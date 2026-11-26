# Muallim Firestore Security Rules — Test Suite (v7.0.0)

Student-only security rules suite for `/user_data/{userId}` on project `muallim-123`.

## Prerequisites

- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools` or `npx firebase-tools`)
- Java JRE 11+ (required by the Firestore emulator)

## Quick Start

```bash
# Terminal 1 — Start Firestore emulator
cd security_rules_test_firestore
npx firebase emulators:start --only firestore

# Terminal 2 — Run Jest rules tests
cd security_rules_test_firestore
npm install
npm test
```

## Covered Policies

- Owner-only `read`, `create`, `update`, and `delete` on `/user_data/{userId}`
- Cross-user and unauthenticated denial on `/user_data/{userId}`
- Immutability of `uid` and `createdAt` on updates
- Role allowlist (`'student' | 'guest'` only — privilege escalation blocked)
- Field allowlist & size bounds (`deletedItems <= 5000`, `fieldUpdatedAt <= 50`, `srs <= 12000`, `weakWords <= 5000`, `starredItems <= 2500`, `customTranslations <= 2500`, `examHistory <= 200`, `completedLessons <= 200`, `studyLog <= 400`, `streak <= 10`, `lastBookmark <= 10`)
- Default deny on all other paths and legacy collections (`/users`, `/pushed_exams`, `/exam_results`, `/muallim_students`, `/muallim_broadcasts`)

## Deploy Rules to Production

```bash
firebase deploy --only firestore:rules --project muallim-123
```
