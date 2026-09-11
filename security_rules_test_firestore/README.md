# Muallim Firestore Security Rules — Test Suite

## Prerequisites

- [ ] Node.js 18+
- [ ] Firebase CLI: `npm install -g firebase-tools`
- [ ] Java JRE 11+ (required for emulator)

## Quick Start

```bash
# Terminal 1 — Start Firestore emulator
cd security_rules_test_firestore
npx firebase emulators:start --only firestore

# Terminal 2 — Run tests
cd security_rules_test_firestore
npm install
npm test
```

## Expected Output

```
users collection
  ✓ owner can read own profile
  ✓ admin can read any profile
  ✓ student cannot read another student profile
  ✓ unauthenticated cannot read any profile
  ✓ admin can create a user doc
  ✓ student cannot create user docs
  ✓ owner can update own non-role fields
  ✓ owner CANNOT escalate own role to admin
  ...
Tests: 37 passed, 37 total
```

## Project ID

`muallim-123`

## Deploy Rules to Production

```bash
# From pwa/ directory
firebase deploy --only firestore:rules --project muallim-123
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "emulator not running" | Run `npx firebase emulators:start --only firestore` first |
| "Java not found" | Install JRE 11+ from https://adoptium.net |
| "port 8080 in use" | Change port in firebase.json and update test setup |
| "permission denied" | Check `FIREBASE_TOKEN` or run `firebase login` |