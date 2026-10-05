const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Aggregates curriculum analytics across all student (user_data)
 * and anonymous guest (guest_data) records.
 *
 * Computes:
 * 1. most_starred_items: sorted by total star count across all learners
 * 2. custom_corrections_needed: items with custom translations (especially >3)
 * 3. weakest_words: aggregate failure counts from weakWords maps
 *
 * Writes output to: curriculum_analytics/aggregated
 */
async function performCurriculumAggregation() {
  const db = admin.firestore();

  const [userDataSnap, guestDataSnap] = await Promise.all([
    db.collection('user_data').get(),
    db.collection('guest_data').get()
  ]);

  const starMap = {}; // key -> { arabic, hinglish, lesson, stars_student, stars_guest, stars_total }
  const customTransMap = {}; // key -> { arabic, original_hinglish, lesson, edits: Set }
  const weakWordsMap = {}; // cleanKey -> { arabic, lesson, count }

  // Process user_data (Students & Teachers)
  userDataSnap.forEach(doc => {
    const data = doc.data() || {};
    const starred = data.starredItems || data.starred || [];
    const custom = data.customTranslations || data.customAnswers || {};
    const weak = data.weakWords || {};

    if (Array.isArray(starred)) {
      starred.forEach(it => {
        const k = it.key || it.id;
        if (!k) return;
        if (!starMap[k]) {
          starMap[k] = {
            key: k,
            arabic: it.arabic || '',
            hinglish: it.hinglish || '',
            lesson: it.stage && it.lesson ? `S${it.stage}L${it.lesson}` : (k.split('_')[0] || ''),
            stars_student: 0,
            stars_guest: 0,
            stars_total: 0
          };
        }
        starMap[k].stars_student++;
        starMap[k].stars_total++;
      });
    }

    if (typeof custom === 'object') {
      Object.keys(custom).forEach(k => {
        const trans = custom[k];
        if (!trans || typeof trans !== 'string') return;
        if (!customTransMap[k]) {
          customTransMap[k] = {
            key: k,
            arabic: '',
            original_hinglish: '',
            lesson: k.split('_')[0] || '',
            edits: new Set()
          };
        }
        customTransMap[k].edits.add(trans.trim());
      });
    }

    if (typeof weak === 'object') {
      Object.keys(weak).forEach(k => {
        const w = weak[k];
        if (!w) return;
        if (!weakWordsMap[k]) {
          weakWordsMap[k] = {
            key: k,
            arabic: w.arabic || '',
            lesson: w.lesson || '',
            count: 0
          };
        }
        weakWordsMap[k].count += (Number(w.count) || 1);
      });
    }
  });

  // Process guest_data (Anonymous Guests)
  guestDataSnap.forEach(doc => {
    const data = doc.data() || {};
    const starred = data.starredItems || data.starred || [];
    const custom = data.customTranslations || data.customAnswers || {};

    if (Array.isArray(starred)) {
      starred.forEach(it => {
        const k = it.key || it.id;
        if (!k) return;
        if (!starMap[k]) {
          starMap[k] = {
            key: k,
            arabic: it.arabic || '',
            hinglish: it.hinglish || '',
            lesson: it.stage && it.lesson ? `S${it.stage}L${it.lesson}` : (k.split('_')[0] || ''),
            stars_student: 0,
            stars_guest: 0,
            stars_total: 0
          };
        }
        starMap[k].stars_guest++;
        starMap[k].stars_total++;
      });
    }

    if (typeof custom === 'object') {
      Object.keys(custom).forEach(k => {
        const trans = custom[k];
        if (!trans || typeof trans !== 'string') return;
        if (!customTransMap[k]) {
          customTransMap[k] = {
            key: k,
            arabic: '',
            original_hinglish: '',
            lesson: k.split('_')[0] || '',
            edits: new Set()
          };
        }
        customTransMap[k].edits.add(trans.trim());
      });
    }
  });

  // Convert to sorted arrays
  const mostStarred = Object.values(starMap)
    .sort((a, b) => b.stars_total - a.stars_total)
    .slice(0, 100);

  const customCorrections = Object.values(customTransMap)
    .map(c => ({
      key: c.key,
      arabic: c.arabic,
      original_hinglish: c.original_hinglish,
      lesson: c.lesson,
      edit_count: c.edits.size,
      sample_edits: Array.from(c.edits).slice(0, 5)
    }))
    .sort((a, b) => b.edit_count - a.edit_count)
    .slice(0, 50);

  const weakestWords = Object.values(weakWordsMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 100);

  const aggregatedPayload = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    studentCount: userDataSnap.size,
    guestCount: guestDataSnap.size,
    most_starred_items: mostStarred,
    custom_corrections_needed: customCorrections,
    weakest_words: weakestWords
  };

  await db.collection('curriculum_analytics').doc('aggregated').set(aggregatedPayload, { merge: true });
  console.log(`[aggregateCurriculum] Successfully aggregated ${userDataSnap.size} students and ${guestDataSnap.size} guests.`);
  return aggregatedPayload;
}

// Scheduled Cloud Function running daily at 03:00 AM UTC
const scheduledAggregateCurriculum = functions.pubsub
  .schedule('0 3 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    return await performCurriculumAggregation();
  });

// Callable endpoint for admin on-demand trigger
const triggerCurriculumAggregation = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Caller must be authenticated');
  }
  const callerDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only administrators can run aggregation');
  }
  const result = await performCurriculumAggregation();
  return { success: true, studentCount: result.studentCount, guestCount: result.guestCount };
});

module.exports = {
  performCurriculumAggregation,
  scheduledAggregateCurriculum,
  triggerCurriculumAggregation
};
