/**
 * Firestore Security Rules Test Suite — muallim-123
 * Uses @firebase/rules-unit-testing v3 with Jest
 * Run: npm test (with emulator on port 8080)
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

// ── Helpers ────────────────────────────────────────────────────
function adminCtx() { return testEnv.authenticatedContext("admin-uid"); }
function studentCtx(uid = "student-uid") { return testEnv.authenticatedContext(uid); }
function anonCtx() { return testEnv.unauthenticatedContext(); }

// Pre-seed admin user doc so isAdmin() works
async function seedAdminDoc() {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await ctx.firestore().doc("users/admin-uid").set({
      email: "ustaad@muallim.app",
      name: "Ustaad",
      role: "admin",
      createdAt: new Date(),
    });
  });
}

async function seedStudentDoc(uid = "student-uid") {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await ctx.firestore().doc("users/" + uid).set({
      email: uid + "@test.com",
      name: "Test Student",
      role: "student",
      createdAt: new Date(),
    });
  });
}

// ── Setup / Teardown ──────────────────────────────────────────
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
  await seedAdminDoc();
  await seedStudentDoc();
});

afterAll(async () => {
  await testEnv.cleanup();
});

// ═══════════════════════════════════════════════════════════════
// COLLECTION: users
// ═══════════════════════════════════════════════════════════════
describe("users collection", () => {
  // READ
  test("owner can read own profile", async () => {
    await assertSucceeds(studentCtx().firestore().doc("users/student-uid").get());
  });
  test("admin can read any profile", async () => {
    await assertSucceeds(adminCtx().firestore().doc("users/student-uid").get());
  });
  test("student cannot read another student profile", async () => {
    await assertFails(studentCtx("other-uid").firestore().doc("users/student-uid").get());
  });
  test("unauthenticated cannot read any profile", async () => {
    await assertFails(anonCtx().firestore().doc("users/student-uid").get());
  });

  // CREATE
  test("admin can create a user doc", async () => {
    await assertSucceeds(
      adminCtx().firestore().doc("users/new-uid").set({
        email: "new@test.com", name: "New User", role: "student", createdAt: new Date(),
      })
    );
  });
  test("student cannot create user docs", async () => {
    await assertFails(
      studentCtx().firestore().doc("users/new-uid").set({
        email: "x@y.com", name: "Hacker", role: "student", createdAt: new Date(),
      })
    );
  });
  test("unauthenticated cannot create user docs", async () => {
    await assertFails(
      anonCtx().firestore().doc("users/new-uid").set({ name: "Anon" })
    );
  });

  // UPDATE — privilege escalation prevention
  test("owner can update own non-role fields", async () => {
    await assertSucceeds(
      studentCtx().firestore().doc("users/student-uid").update({ name: "Updated Name" })
    );
  });
  test("owner CANNOT escalate own role to admin", async () => {
    await assertFails(
      studentCtx().firestore().doc("users/student-uid").update({ role: "admin" })
    );
  });
  test("admin can update role on any user", async () => {
    await assertSucceeds(
      adminCtx().firestore().doc("users/student-uid").update({ role: "admin" })
    );
  });
  test("student cannot update another student profile", async () => {
    await assertFails(
      studentCtx("other-uid").firestore().doc("users/student-uid").update({ name: "Hacked" })
    );
  });

  // DELETE
  test("admin can delete a user doc", async () => {
    await assertSucceeds(adminCtx().firestore().doc("users/student-uid").delete());
  });
  test("student cannot delete any user doc", async () => {
    await assertFails(studentCtx().firestore().doc("users/student-uid").delete());
  });
});

// ═══════════════════════════════════════════════════════════════
// COLLECTION: user_data
// ═══════════════════════════════════════════════════════════════
describe("user_data collection", () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("user_data/student-uid").set({
        starred: ["item-1"], bookmark: { stage: 1, lesson: 2 },
      });
    });
  });

  test("owner can read own user_data", async () => {
    await assertSucceeds(studentCtx().firestore().doc("user_data/student-uid").get());
  });
  test("admin can read any user_data", async () => {
    await assertSucceeds(adminCtx().firestore().doc("user_data/student-uid").get());
  });
  test("student cannot read another student user_data", async () => {
    await assertFails(studentCtx("other-uid").firestore().doc("user_data/student-uid").get());
  });
  test("owner can update own user_data", async () => {
    await assertSucceeds(
      studentCtx().firestore().doc("user_data/student-uid").update({ starred: ["item-1", "item-2"] })
    );
  });
  test("student cannot write another student user_data", async () => {
    await assertFails(
      studentCtx("other-uid").firestore().doc("user_data/student-uid").set({ starred: [] })
    );
  });
  test("unauthenticated cannot read user_data", async () => {
    await assertFails(anonCtx().firestore().doc("user_data/student-uid").get());
  });
});

// ═══════════════════════════════════════════════════════════════
// COLLECTION: pushed_exams
// ═══════════════════════════════════════════════════════════════
describe("pushed_exams collection", () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("pushed_exams/exam-1").set({
        title: "Lesson 1 Quiz", questions: [], pushedAt: new Date(), pushedBy: "admin-uid",
      });
    });
  });

  test("authenticated student can read pushed exams", async () => {
    await assertSucceeds(studentCtx().firestore().doc("pushed_exams/exam-1").get());
  });
  test("unauthenticated cannot read pushed exams", async () => {
    await assertFails(anonCtx().firestore().doc("pushed_exams/exam-1").get());
  });
  test("admin can create pushed exam", async () => {
    await assertSucceeds(
      adminCtx().firestore().doc("pushed_exams/exam-2").set({
        title: "Lesson 2 Quiz", questions: [], pushedAt: new Date(), pushedBy: "admin-uid",
      })
    );
  });
  test("student cannot create pushed exam", async () => {
    await assertFails(
      studentCtx().firestore().doc("pushed_exams/exam-2").set({ title: "Hacked Quiz" })
    );
  });
  test("student cannot delete pushed exam", async () => {
    await assertFails(studentCtx().firestore().doc("pushed_exams/exam-1").delete());
  });
  test("admin can delete pushed exam", async () => {
    await assertSucceeds(adminCtx().firestore().doc("pushed_exams/exam-1").delete());
  });
});

// ═══════════════════════════════════════════════════════════════
// COLLECTION: exam_results
// ═══════════════════════════════════════════════════════════════
describe("exam_results collection", () => {
  const RESULT = {
    score: 85, answers: ["a", "b"], submittedAt: new Date(), uid: "student-uid",
  };
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("exam_results/exam-1/student-uid").set(RESULT);
    });
  });

  test("student can read own result", async () => {
    await assertSucceeds(studentCtx().firestore().doc("exam_results/exam-1/student-uid").get());
  });
  test("admin can read any result", async () => {
    await assertSucceeds(adminCtx().firestore().doc("exam_results/exam-1/student-uid").get());
  });
  test("student cannot read another student result", async () => {
    await assertFails(studentCtx("other-uid").firestore().doc("exam_results/exam-1/student-uid").get());
  });
  test("student can create own result with correct uid", async () => {
    await assertSucceeds(
      studentCtx().firestore().doc("exam_results/exam-1/student-uid").set({ ...RESULT })
    );
  });
  test("student cannot create result with spoofed uid", async () => {
    await assertFails(
      studentCtx("other-uid").firestore().doc("exam_results/exam-1/student-uid").set({
        ...RESULT, uid: "student-uid",
      })
    );
  });
  test("student cannot update existing result", async () => {
    await assertFails(
      studentCtx().firestore().doc("exam_results/exam-1/student-uid").update({ score: 100 })
    );
  });
  test("admin can update result", async () => {
    await assertSucceeds(
      adminCtx().firestore().doc("exam_results/exam-1/student-uid").update({ score: 90 })
    );
  });
  test("admin cannot change uid on update (ownership immutability)", async () => {
    await assertFails(
      adminCtx().firestore().doc("exam_results/exam-1/student-uid").update({ uid: "hacked-uid" })
    );
  });
});

// ═══════════════════════════════════════════════════════════════
// COLLECTION: muallim_students (legacy)
// ═══════════════════════════════════════════════════════════════
describe("muallim_students (legacy) collection", () => {
  const VALID_DOC = { deviceId: "dev_abc123", name: "Ali" };

  test("anyone can read muallim_students", async () => {
    await assertSucceeds(anonCtx().firestore().doc("muallim_students/dev_abc123").get());
  });
  test("can write with valid deviceId + name", async () => {
    await assertSucceeds(
      anonCtx().firestore().doc("muallim_students/dev_abc123").set(VALID_DOC)
    );
  });
  test("cannot write with mismatched deviceId", async () => {
    await assertFails(
      anonCtx().firestore().doc("muallim_students/dev_abc123").set({ deviceId: "dev_WRONG", name: "Ali" })
    );
  });
  test("cannot write without name field", async () => {
    await assertFails(
      anonCtx().firestore().doc("muallim_students/dev_abc123").set({ deviceId: "dev_abc123" })
    );
  });
  test("cannot write with name > 100 chars", async () => {
    await assertFails(
      anonCtx().firestore().doc("muallim_students/dev_abc123").set({
        deviceId: "dev_abc123", name: "x".repeat(101),
      })
    );
  });
  test("cannot write with empty name", async () => {
    await assertFails(
      anonCtx().firestore().doc("muallim_students/dev_abc123").set({ deviceId: "dev_abc123", name: "" })
    );
  });
});

// ═══════════════════════════════════════════════════════════════
// COLLECTION: muallim_broadcasts (legacy)
// ═══════════════════════════════════════════════════════════════
describe("muallim_broadcasts (legacy) collection", () => {
  const VALID_MSG = { message: "Test broadcast!", sentAt: new Date() };

  test("anyone can read broadcasts", async () => {
    await assertSucceeds(anonCtx().firestore().doc("muallim_broadcasts/msg-1").get());
  });
  test("authenticated user can create valid broadcast", async () => {
    await assertSucceeds(
      studentCtx().firestore().doc("muallim_broadcasts/msg-1").set(VALID_MSG)
    );
  });
  test("unauthenticated cannot create broadcast (spam prevention)", async () => {
    await assertFails(
      anonCtx().firestore().doc("muallim_broadcasts/msg-1").set(VALID_MSG)
    );
  });
  test("cannot create broadcast with empty message", async () => {
    await assertFails(
      studentCtx().firestore().doc("muallim_broadcasts/msg-1").set({ message: "", sentAt: new Date() })
    );
  });
  test("cannot create broadcast with message > 500 chars", async () => {
    await assertFails(
      studentCtx().firestore().doc("muallim_broadcasts/msg-1").set({
        message: "x".repeat(501), sentAt: new Date(),
      })
    );
  });
  test("cannot update a broadcast (immutable)", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("muallim_broadcasts/msg-1").set(VALID_MSG);
    });
    await assertFails(
      studentCtx().firestore().doc("muallim_broadcasts/msg-1").update({ message: "changed" })
    );
  });
  test("cannot delete a broadcast", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("muallim_broadcasts/msg-1").set(VALID_MSG);
    });
    await assertFails(adminCtx().firestore().doc("muallim_broadcasts/msg-1").delete());
  });
});

// ═══════════════════════════════════════════════════════════════
// DEFAULT DENY — arbitrary paths
// ═══════════════════════════════════════════════════════════════
describe("default deny — arbitrary paths", () => {
  test("cannot read arbitrary collection", async () => {
    await assertFails(studentCtx().firestore().doc("random_collection/any-doc").get());
  });
  test("admin cannot read arbitrary collection", async () => {
    await assertFails(adminCtx().firestore().doc("secret_data/anything").get());
  });
  test("unauthenticated cannot read arbitrary collection", async () => {
    await assertFails(anonCtx().firestore().doc("users_backup/anything").get());
  });
});