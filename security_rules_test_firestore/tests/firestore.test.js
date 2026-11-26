/**
 * Firestore Security Rules Test Suite — muallim-123 (v7.0.0 Student-Only)
 * Uses @firebase/rules-unit-testing v3 with Jest
 * Run: npm test (with Firestore emulator running on localhost:8080)
 */

const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require("@firebase/rules-unit-testing");
const fs = require("fs");
const path = require("path");

const PROJECT_ID = "muallim-123";
const RULES_PATH = path.resolve(__dirname, "../firestore.rules");

let testEnv;

function ownerCtx(uid = "student-uid") {
  return testEnv.authenticatedContext(uid);
}

function otherCtx() {
  return testEnv.authenticatedContext("other-student-uid");
}

function anonCtx() {
  return testEnv.unauthenticatedContext();
}

function makeMap(prefix, count) {
  const obj = {};
  for (let i = 0; i < count; i += 1) {
    obj[`${prefix}_${i}`] = i;
  }
  return obj;
}

function validUserPayload(uid = "student-uid", overrides = {}) {
  return {
    uid,
    name: "Learner One",
    deviceId: "dev_abc123",
    role: "student",
    preferredLang: "hinglish",
    theme: "parchment",
    currentStage: 1,
    currentLesson: 1,
    streak: { current: 3, longest: 7, lastStudyDate: "2026-11-26" },
    completedLessons: { S1L1: true },
    studyLog: { "2026-11-26": 12 },
    starredItems: [{ key: "S1L1_num_1", arabic: "كِتَابٌ" }],
    customTranslations: { S1L1_num_1: "Kitaab" },
    lastBookmark: { stage: 1, lesson: 1, itemId: 1 },
    srs: { S1L1_num_1: { box: 2, nextReview: 1795700000000, lastReview: 1795600000000 } },
    weakWords: { S1L1_num_2: { key: "S1L1_num_2", misses: 1 } },
    examHistory: [{ examId: "vol1", score: 45, total: 50, pct: 90 }],
    deletedItems: { S1L1_num_99: 1795600000000 },
    fieldUpdatedAt: { theme: 1795600000000, preferredLang: 1795600000000 },
    createdAt: new Date("2026-11-01T00:00:00Z"),
    lastSeen: new Date("2026-11-26T00:00:00Z"),
    updatedAt: new Date("2026-11-26T00:00:00Z"),
    ...overrides,
  };
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: fs.readFileSync(RULES_PATH, "utf8"),
      host: "localhost",
      port: 8080,
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

// ═══════════════════════════════════════════════════════════════
// COLLECTION: /user_data/{userId}
// ═══════════════════════════════════════════════════════════════
describe("user_data collection (v7.0 student-only)", () => {
  test("owner can create valid user_data doc with deletedItems and fieldUpdatedAt", async () => {
    await assertSucceeds(
      ownerCtx().firestore().doc("user_data/student-uid").set(validUserPayload())
    );
  });

  test("owner can read own user_data doc", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("user_data/student-uid").set(validUserPayload());
    });
    await assertSucceeds(ownerCtx().firestore().doc("user_data/student-uid").get());
  });

  test("owner can update allowed fields and tombstones", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("user_data/student-uid").set(validUserPayload());
    });
    await assertSucceeds(
      ownerCtx().firestore().doc("user_data/student-uid").update({
        theme: "sepia",
        deletedItems: { S1L1_num_1: 1795700000000 },
        fieldUpdatedAt: { theme: 1795700000000 },
        updatedAt: new Date(),
      })
    );
  });

  test("owner can delete own user_data doc", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("user_data/student-uid").set(validUserPayload());
    });
    await assertSucceeds(ownerCtx().firestore().doc("user_data/student-uid").delete());
  });

  test("cross-user read, create, update, and delete are denied", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("user_data/student-uid").set(validUserPayload());
    });
    await assertFails(otherCtx().firestore().doc("user_data/student-uid").get());
    await assertFails(
      otherCtx().firestore().doc("user_data/student-uid").set(validUserPayload("student-uid"))
    );
    await assertFails(
      otherCtx().firestore().doc("user_data/student-uid").update({ name: "Hijacked" })
    );
    await assertFails(otherCtx().firestore().doc("user_data/student-uid").delete());
  });

  test("unauthenticated read, write, and delete are denied", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("user_data/student-uid").set(validUserPayload());
    });
    await assertFails(anonCtx().firestore().doc("user_data/student-uid").get());
    await assertFails(
      anonCtx().firestore().doc("user_data/student-uid").set(validUserPayload())
    );
    await assertFails(anonCtx().firestore().doc("user_data/student-uid").delete());
  });

  test("rejects mismatched uid on create", async () => {
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").set(
        validUserPayload("other-student-uid")
      )
    );
  });

  test("enforces uid and createdAt immutability on update", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("user_data/student-uid").set(validUserPayload());
    });
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").update({ uid: "other-student-uid" })
    );
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").update({
        createdAt: new Date("2026-12-01T00:00:00Z"),
      })
    );
  });

  test("blocks role privilege escalation (only 'student' or 'guest' allowed)", async () => {
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").set(
        validUserPayload("student-uid", { role: "admin" })
      )
    );
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").set(
        validUserPayload("student-uid", { role: "teacher" })
      )
    );
    await assertSucceeds(
      ownerCtx().firestore().doc("user_data/student-uid").set(
        validUserPayload("student-uid", { role: "guest" })
      )
    );
  });

  test("rejects unknown fields outside allowlist and empty documents", async () => {
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").set({})
    );
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").set(
        validUserPayload("student-uid", { isAdmin: true })
      )
    );
  });

  test("validates theme, currentStage, and currentLesson bounds", async () => {
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").set(
        validUserPayload("student-uid", { theme: "neon" })
      )
    );
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").set(
        validUserPayload("student-uid", { currentStage: 8 })
      )
    );
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").set(
        validUserPayload("student-uid", { currentLesson: 31 })
      )
    );
  });

  test("enforces map and list size caps including deletedItems (5000) and fieldUpdatedAt (50)", async () => {
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").set({
        fieldUpdatedAt: makeMap("f", 51),
      })
    );
    await assertSucceeds(
      ownerCtx().firestore().doc("user_data/student-uid").set({
        fieldUpdatedAt: makeMap("f", 50),
      })
    );
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").set({
        streak: makeMap("k", 11),
      })
    );
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").set({
        deletedItems: makeMap("d", 5001),
      })
    );
    await assertFails(
      ownerCtx().firestore().doc("user_data/student-uid").set({
        starredItems: new Array(2501).fill({ key: "x" }),
      })
    );
  });
});

// ═══════════════════════════════════════════════════════════════
// DEFAULT DENY — removed & arbitrary collections
// ═══════════════════════════════════════════════════════════════
describe("default deny — legacy and arbitrary paths", () => {
  const deniedPaths = [
    "users/student-uid",
    "pushed_exams/exam-1",
    "exam_results/exam-1",
    "muallim_students/dev_abc123",
    "muallim_broadcasts/msg-1",
    "random_collection/any-doc",
  ];

  test.each(deniedPaths)("denies read and write on %s", async (docPath) => {
    await assertFails(ownerCtx().firestore().doc(docPath).get());
    await assertFails(ownerCtx().firestore().doc(docPath).set({ test: true }));
    await assertFails(anonCtx().firestore().doc(docPath).get());
  });
});
