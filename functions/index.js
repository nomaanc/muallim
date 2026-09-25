const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Callable function: setStudentPassword
 * Allows authenticated admin users to update a student's password directly via Firebase Admin SDK.
 *
 * Args:
 * - data.uid (string, required): UID of student
 * - data.newPassword (string, required): New password (min 6 characters)
 */
exports.setStudentPassword = functions.https.onCall(async (data, context) => {
  // 1. Verify caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called by an authenticated user.'
    );
  }

  const callerUid = context.auth.uid;

  // 2. Verify caller has admin role in Firestore
  const callerDoc = await admin.firestore().collection('users').doc(callerUid).get();
  if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only administrators can change student passwords.'
    );
  }

  // 3. Validate inputs
  const targetUid = data && data.uid;
  const newPassword = data && data.newPassword;

  if (!targetUid || typeof targetUid !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Target student UID is required.'
    );
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Password must be at least 6 characters long.'
    );
  }

  try {
    // 4. Update password via Firebase Admin Auth
    await admin.auth().updateUser(targetUid, {
      password: newPassword
    });

    return {
      success: true,
      message: `Password successfully updated for user ${targetUid}`
    };
  } catch (error) {
    console.error('Error updating student password:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Failed to update student password.'
    );
  }
});
