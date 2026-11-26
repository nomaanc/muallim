// @ts-check

/**
 * Muallim ul-Qur'an — Optional Firebase Auth & Firestore Sync (v7.0)
 * Lazy-loaded strictly when the user signs in (or resumes an opted-in session).
 * Syncs strictly to /user_data/{uid} with zero teacher/admin/broadcast paths.
 */

import { store, STORE_KEYS, lsGet, lsSet, normalizeTheme, normalizeLang, normalizeSrsKey } from './store.js';

const FIREBASE_VER = '10.12.0';
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAjBnuLSADlXBZ7OY7daQ7mOta3VaHXVNg',
  authDomain: 'muallim-123.firebaseapp.com',
  projectId: 'muallim-123',
  storageBucket: 'muallim-123.firebasestorage.app',
  messagingSenderId: '226964645326',
  appId: '1:226964645326:web:0a219c95dad277b4cd379f'
};

/**
 * Read a field-level timestamp from cloud payload with Firestore updatedAt fallback.
 * @param {any} data
 * @param {string} field
 * @returns {number}
 */
function getCloudFieldTs(data, field) {
  const fTs = Number(data?.fieldUpdatedAt?.[field]);
  if (Number.isFinite(fTs) && fTs > 0) return fTs;
  const u = data?.updatedAt;
  if (u && typeof u.toMillis === 'function') return u.toMillis();
  if (typeof u === 'number' && Number.isFinite(u)) return u;
  return 0;
}

/**
 * Lookup deletion timestamp checking domain-prefixed tombstone first, then raw key.
 * @param {Record<string, number>} deletedItems
 * @param {string} prefix
 * @param {string} key
 * @returns {number}
 */
function getTombstoneTs(deletedItems, prefix, key) {
  const p = Number(deletedItems[`${prefix}:${key}`]) || 0;
  const raw = Number(deletedItems[key]) || 0;
  return Math.max(p, raw);
}

class CloudSync {
  constructor() {
    /** @type {{uid: string, email: string, name: string} | null} */
    this.user = null;
    /** @type {'offline' | 'connecting' | 'synced' | 'error'} */
    this.status = 'offline';
    this.statusMessage = 'Offline / Local only';
    this._loaded = false;
    this._loadingPromise = /** @type {Promise<boolean> | null} */ (null);
    this._db = /** @type {any} */ (null);
    this._auth = /** @type {any} */ (null);
    this._fs = /** @type {any} */ (null);
    this._fa = /** @type {any} */ (null);
    this._syncTimer = 0;
    /** @type {Set<() => void>} */
    this._listeners = new Set();
  }

  /**
   * @param {() => void} fn
   * @returns {() => void}
   */
  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _notify() {
    this._listeners.forEach(fn => {
      try { fn(); } catch (err) { console.warn('[Sync] Listener error:', err); }
    });
  }

  /**
   * Only auto-initialize on startup if the user previously opted into sign-in.
   * Ensures zero external Firebase network requests for offline/guest learners.
   */
  restoreIfOptedIn() {
    if (lsGet(STORE_KEYS.authOptIn, '') === '1' && navigator.onLine !== false) {
      this.ensureLoaded().catch(err => {
        this._setStatus('error', `Sync unavailable: ${err.message}`);
      });
    }
  }

  /**
   * @param {'offline' | 'connecting' | 'synced' | 'error'} status
   * @param {string} msg
   */
  _setStatus(status, msg) {
    this.status = status;
    this.statusMessage = msg;
    this._notify();
  }

  async ensureLoaded() {
    if (this._loaded) return true;
    if (this._loadingPromise) return this._loadingPromise;

    this._setStatus('connecting', 'Connecting to cloud sync...');
    this._loadingPromise = (async () => {
      try {
        const appMod = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_VER}/firebase-app.js`);
        const fsMod = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_VER}/firebase-firestore.js`);
        const authMod = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_VER}/firebase-auth.js`);

        const apps = appMod.getApps();
        const fbApp = apps.length > 0 ? apps[0] : appMod.initializeApp(DEFAULT_FIREBASE_CONFIG);
        this._db = fsMod.getFirestore(fbApp);
        this._auth = authMod.getAuth(fbApp);
        this._fs = fsMod;
        this._fa = authMod;
        this._loaded = true;

        authMod.onAuthStateChanged(this._auth, async (fbUser) => {
          if (!fbUser || fbUser.isAnonymous) {
            this.user = null;
            this._setStatus('offline', 'Local mode (not signed in)');
            return;
          }
          this.user = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || fbUser.email || 'Learner'
          };
          lsSet(STORE_KEYS.authOptIn, '1');
          await this.pullFromCloud();
          await this.pushToCloud();
        });
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Firebase SDK unavailable offline';
        this._setStatus('error', `Cloud sync offline (${msg})`);
        throw err;
      } finally {
        this._loadingPromise = null;
      }
    })();

    return this._loadingPromise;
  }

  /**
   * @param {string} email
   * @param {string} password
   * @param {boolean} [createNew]
   */
  async signInWithEmail(email, password, createNew = false) {
    await this.ensureLoaded();
    if (createNew) {
      await this._fa.createUserWithEmailAndPassword(this._auth, email, password);
    } else {
      await this._fa.signInWithEmailAndPassword(this._auth, email, password);
    }
    lsSet(STORE_KEYS.authOptIn, '1');
  }

  async signInWithGoogle() {
    await this.ensureLoaded();
    const provider = new this._fa.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await this._fa.signInWithPopup(this._auth, provider);
    lsSet(STORE_KEYS.authOptIn, '1');
  }

  /**
   * Send Firebase password reset email for the Settings Forgot Password action.
   * @param {string} email
   */
  async sendPasswordReset(email) {
    const cleanEmail = String(email || '').trim();
    if (!cleanEmail) {
      throw new Error('Enter your email address first.');
    }
    await this.ensureLoaded();
    if (!this._fa || !this._auth) {
      throw new Error('Authentication service unavailable.');
    }
    await this._fa.sendPasswordResetEmail(this._auth, cleanEmail);
  }

  async signOut() {
    if (!this._auth || !this._fa) return;
    await this._fa.signOut(this._auth);
    lsSet(STORE_KEYS.authOptIn, '0');
    this.user = null;
    this._setStatus('offline', 'Signed out (local data kept)');
  }

  queuePush() {
    if (!this.user || !this._db) return;
    clearTimeout(this._syncTimer);
    this._syncTimer = window.setTimeout(() => {
      this.pushToCloud().catch(err => {
        console.warn('[Sync] Deferred push failed:', err);
      });
    }, 1200);
  }

  async pullFromCloud() {
    if (!this.user || !this._db || !this._fs) return;
    try {
      const { doc, getDoc } = this._fs;
      const snap = await getDoc(doc(this._db, 'user_data', this.user.uid));
      if (!snap.exists()) return;
      const data = snap.data();

      let changed = false;

      // 1. Merge tombstones (deletedItems) and per-field timestamps
      /** @type {Record<string, number>} */
      const mergedDeleted = { ...store.deletedItems };
      if (data.deletedItems && typeof data.deletedItems === 'object' && !Array.isArray(data.deletedItems)) {
        for (const [k, ts] of Object.entries(data.deletedItems)) {
          mergedDeleted[k] = Math.max(Number(mergedDeleted[k]) || 0, Number(ts) || 0);
        }
      }

      /** @type {Record<string, number>} */
      const mergedFieldTs = { ...store.fieldUpdatedAt };
      if (data.fieldUpdatedAt && typeof data.fieldUpdatedAt === 'object' && !Array.isArray(data.fieldUpdatedAt)) {
        for (const [k, ts] of Object.entries(data.fieldUpdatedAt)) {
          mergedFieldTs[k] = Math.max(Number(mergedFieldTs[k]) || 0, Number(ts) || 0);
        }
      }

      // 2. Merge starredItems honoring deletedItems tombstones
      const cloudFavs = Array.isArray(data.starredItems) ? data.starredItems : (Array.isArray(data.starred) ? data.starred : []);
      /** @type {Map<string, any>} */
      const favMap = new Map();
      for (const item of store.favs) {
        if (item && item.key) favMap.set(item.key, item);
      }
      for (const item of cloudFavs) {
        if (!item || !item.key) continue;
        const existing = favMap.get(item.key);
        if (!existing || (Number(item.starredAt) || 0) > (Number(existing.starredAt) || 0)) {
          favMap.set(item.key, item);
        }
      }
      const mergedFavs = [];
      for (const [k, item] of favMap.entries()) {
        const delTs = getTombstoneTs(mergedDeleted, 'fav', k);
        const itemTs = Number(item.starredAt) || 0;
        if (delTs > itemTs) continue;
        mergedFavs.push(item);
      }
      if (JSON.stringify(mergedFavs) !== JSON.stringify(store.favs)) {
        store.favs = mergedFavs;
        lsSet(STORE_KEYS.favs, JSON.stringify(store.favs));
        changed = true;
      }

      // 3. Merge customTranslations honoring deletedItems tombstones
      const cloudNotes = (data.customTranslations || data.customAnswers || {});
      if (typeof cloudNotes === 'object' && !Array.isArray(cloudNotes)) {
        /** @type {Record<string, string>} */
        const mergedNotes = {};
        const noteKeys = new Set([...Object.keys(store.customNotes), ...Object.keys(cloudNotes)]);
        for (const k of noteKeys) {
          const delTs = getTombstoneTs(mergedDeleted, 'note', k);
          const localVal = typeof store.customNotes[k] === 'string' ? store.customNotes[k].trim() : '';
          const cloudVal = typeof cloudNotes[k] === 'string' ? cloudNotes[k].trim() : '';
          const localTs = Number(store.fieldUpdatedAt[`note:${k}`]) || 0;
          const cloudTs = Number(data.fieldUpdatedAt?.[`note:${k}`]) || 0;
          const valTs = Math.max(localTs, cloudTs);
          if (delTs > valTs) continue;
          const chosen = (cloudVal && (!localVal || cloudTs > localTs)) ? cloudVal : (localVal || cloudVal);
          if (chosen) mergedNotes[k] = chosen;
        }
        if (JSON.stringify(mergedNotes) !== JSON.stringify(store.customNotes)) {
          store.customNotes = mergedNotes;
          lsSet(STORE_KEYS.customTranslations, JSON.stringify(store.customNotes));
          changed = true;
        }
      }

      // 4. Merge completedLessons honoring deletedItems tombstones
      const cloudCompleted = (data.completedLessons && typeof data.completedLessons === 'object' && !Array.isArray(data.completedLessons))
        ? data.completedLessons
        : {};
      /** @type {Record<string, {completedAt: number}>} */
      const mergedComp = {};
      const compKeys = new Set([...Object.keys(store.completedLessons), ...Object.keys(cloudCompleted)]);
      for (const lKey of compKeys) {
        const delTs = getTombstoneTs(mergedDeleted, 'lesson', lKey);
        const localComp = store.completedLessons[lKey];
        const cloudComp = cloudCompleted[lKey];
        const localTs = Number(localComp?.completedAt) || 0;
        const cloudTs = Number(cloudComp?.completedAt) || 0;
        const bestTs = Math.max(localTs, cloudTs);
        if (delTs > bestTs) continue;
        if (localComp || cloudComp) {
          mergedComp[lKey] = { completedAt: bestTs || Date.now() };
        }
      }
      if (JSON.stringify(mergedComp) !== JSON.stringify(store.completedLessons)) {
        store.completedLessons = mergedComp;
        lsSet(STORE_KEYS.completedLessons, JSON.stringify(store.completedLessons));
        changed = true;
      }

      // 5. Merge studyLog
      if (data.studyLog && typeof data.studyLog === 'object' && !Array.isArray(data.studyLog)) {
        const mergedLog = { ...data.studyLog };
        for (const [day, cnt] of Object.entries(store.studyLog)) {
          mergedLog[day] = Math.max(Number(mergedLog[day]) || 0, Number(cnt) || 0);
        }
        const logKeys = Object.keys(mergedLog).sort();
        if (logKeys.length > 400) {
          for (let i = 0; i < logKeys.length - 400; i++) {
            delete mergedLog[logKeys[i]];
          }
        }
        store.studyLog = mergedLog;
        lsSet(STORE_KEYS.studyLog, JSON.stringify(store.studyLog));
        changed = true;
      }

      // 6. Merge streak
      if (data.streak && typeof data.streak === 'object') {
        const bestLongest = Math.max(Number(data.streak.longest) || 0, store.streak.longest || 0);
        const cloudDate = String(data.streak.lastStudyDate || '');
        const localDate = String(store.streak.lastStudyDate || '');
        let bestCurrent = store.streak.current || 0;
        let bestDate = store.streak.lastStudyDate;
        if (cloudDate > localDate) {
          bestCurrent = Number(data.streak.current) || 0;
          bestDate = cloudDate || null;
        } else if (cloudDate === localDate) {
          bestCurrent = Math.max(bestCurrent, Number(data.streak.current) || 0);
        }
        store.streak = { current: bestCurrent, longest: bestLongest, lastStudyDate: bestDate };
        lsSet(STORE_KEYS.streak, JSON.stringify(store.streak));
        changed = true;
      }

      // 7. Merge SRS per-card using Math.max(local.lastReview || 0, cloud.lastReview || 0)
      if (data.srs && typeof data.srs === 'object' && !Array.isArray(data.srs)) {
        /** @type {Record<string, any>} */
        const mergedSrs = { ...store.srs };
        for (const [rawKey, cloudCard] of Object.entries(data.srs)) {
          if (!cloudCard || typeof cloudCard !== 'object') continue;
          const canonKey = normalizeSrsKey(rawKey);
          const localCard = mergedSrs[canonKey];
          const localTs = Number(localCard?.lastReview) || 0;
          const cloudTs = Number(cloudCard.lastReview) || 0;
          if (!localCard || Math.max(localTs, cloudTs) > localTs) {
            mergedSrs[canonKey] = cloudCard;
            changed = true;
          }
        }
        store.srs = mergedSrs;
        lsSet(STORE_KEYS.srs, JSON.stringify(store.srs));
      }

      // 8. Merge weakWords honoring tombstones
      if (data.weakWords && typeof data.weakWords === 'object' && !Array.isArray(data.weakWords)) {
        /** @type {Record<string, any>} */
        const mergedWeak = {};
        const weakKeys = new Set([...Object.keys(store.weakWords), ...Object.keys(data.weakWords)]);
        for (const k of weakKeys) {
          const localEntry = store.weakWords[k];
          const cloudEntry = data.weakWords[k];
          const delTs = getTombstoneTs(mergedDeleted, 'weak', k);
          const lastMissed = Math.max(Number(localEntry?.lastMissed) || 0, Number(cloudEntry?.lastMissed) || 0);
          if (delTs > lastMissed) continue;
          if (localEntry || cloudEntry) {
            mergedWeak[k] = {
              key: k,
              arabic: String(localEntry?.arabic || cloudEntry?.arabic || ''),
              stage: Number(localEntry?.stage ?? cloudEntry?.stage) || 1,
              lesson: Number(localEntry?.lesson ?? cloudEntry?.lesson) || 1,
              misses: Math.max(Number(localEntry?.misses) || 0, Number(cloudEntry?.misses) || 0),
              lastMissed
            };
          }
        }
        if (JSON.stringify(mergedWeak) !== JSON.stringify(store.weakWords)) {
          store.weakWords = mergedWeak;
          lsSet(STORE_KEYS.weakWords, JSON.stringify(store.weakWords));
          changed = true;
        }
      }

      // 9. Merge examHistory
      if (Array.isArray(data.examHistory)) {
        const seen = new Set(store.examHistory.map(e => `${e.examId}:${e.completedAt}:${e.score}:${e.total}`));
        const nextHistory = [...store.examHistory];
        let addedExam = false;
        for (const item of data.examHistory) {
          if (!item || typeof item !== 'object') continue;
          const sig = `${item.examId}:${item.completedAt}:${item.score}:${item.total}`;
          if (!seen.has(sig)) {
            seen.add(sig);
            nextHistory.push({
              examId: String(item.examId || 'quiz'),
              mode: String(item.mode || 'untimed'),
              score: Number(item.score) || 0,
              total: Number(item.total) || 0,
              pct: Number(item.pct) || 0,
              completedAt: Number(item.completedAt) || 0
            });
            addedExam = true;
          }
        }
        if (addedExam) {
          nextHistory.sort((a, b) => a.completedAt - b.completedAt);
          store.examHistory = nextHistory.slice(-200);
          lsSet(STORE_KEYS.examHistory, JSON.stringify(store.examHistory));
          changed = true;
        }
      }

      // 10. Pull theme, preferredLang, lastBookmark, currentStage, currentLesson when newer
      const cloudThemeTs = getCloudFieldTs(data, 'theme');
      if (data.theme && cloudThemeTs > (Number(store.fieldUpdatedAt.theme) || 0)) {
        const nextTheme = normalizeTheme(data.theme);
        if (nextTheme !== store.theme) {
          store.theme = nextTheme;
          lsSet(STORE_KEYS.theme, nextTheme);
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', nextTheme);
          }
          changed = true;
        }
        mergedFieldTs.theme = cloudThemeTs;
      }

      const cloudLangTs = getCloudFieldTs(data, 'preferredLang');
      if (data.preferredLang && cloudLangTs > (Number(store.fieldUpdatedAt.preferredLang) || 0)) {
        const nextLang = normalizeLang(data.preferredLang);
        if (nextLang !== store.lang) {
          store.lang = nextLang;
          lsSet(STORE_KEYS.lang, nextLang);
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-lang', nextLang);
          }
          changed = true;
        }
        mergedFieldTs.preferredLang = cloudLangTs;
      }

      const cloudBmTs = Math.max(Number(data.lastBookmark?.savedAt) || 0, Number(data.fieldUpdatedAt?.lastBookmark) || 0);
      const localBmTs = Math.max(Number(store.bookmark?.savedAt) || 0, Number(store.fieldUpdatedAt.lastBookmark) || 0);
      if (data.lastBookmark !== undefined && cloudBmTs > localBmTs) {
        store.bookmark = data.lastBookmark && typeof data.lastBookmark === 'object' ? data.lastBookmark : null;
        if (store.bookmark) {
          lsSet(STORE_KEYS.bookmark, JSON.stringify(store.bookmark));
        } else {
          try { localStorage.removeItem(STORE_KEYS.bookmark); } catch (_) { /* ignore */ }
        }
        mergedFieldTs.lastBookmark = cloudBmTs;
        changed = true;
      }

      const cloudPosTs = getCloudFieldTs(data, 'position') || getCloudFieldTs(data, 'currentStage');
      const localPosTs = Number(store.fieldUpdatedAt.position) || Number(store.fieldUpdatedAt.currentStage) || 0;
      if (data.currentStage && data.currentLesson && cloudPosTs > localPosTs) {
        const nextUnit = Math.min(7, Math.max(1, Number(data.currentStage) || 1));
        const nextLesson = Math.max(1, Number(data.currentLesson) || 1);
        if (nextUnit !== store.currentUnit || nextLesson !== store.currentLesson) {
          store.currentUnit = nextUnit;
          store.currentLesson = nextLesson;
          store.lastSession = {
            stage: nextUnit,
            lesson: nextLesson,
            title: `Unit ${nextUnit} Lesson ${nextLesson}`,
            updatedAt: cloudPosTs
          };
          lsSet(STORE_KEYS.lastSession, JSON.stringify(store.lastSession));
          changed = true;
        }
        mergedFieldTs.position = cloudPosTs;
      }

      store.deletedItems = mergedDeleted;
      lsSet(STORE_KEYS.deletedItems, JSON.stringify(mergedDeleted));
      store.fieldUpdatedAt = mergedFieldTs;
      lsSet(STORE_KEYS.fieldUpdatedAt, JSON.stringify(mergedFieldTs));

      if (changed) store.emit('cloudPull', false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sync read failed';
      this._setStatus('error', `Could not fetch cloud data: ${msg}`);
    }
  }

  async pushToCloud() {
    if (!this.user || !this._db || !this._fs) return;
    try {
      const { doc, setDoc, serverTimestamp } = this._fs;
      const payload = {
        uid: this.user.uid,
        name: (lsGet(STORE_KEYS.studentName, '') || this.user.name || '').slice(0, 100),
        deviceId: store.getDeviceId(),
        role: 'student',
        preferredLang: store.lang,
        theme: store.theme,
        currentStage: store.currentUnit,
        currentLesson: store.currentLesson,
        streak: {
          current: store.streak.current || 0,
          longest: store.streak.longest || 0,
          lastStudyDate: store.streak.lastStudyDate || ''
        },
        completedLessons: store.completedLessons,
        studyLog: store.studyLog,
        starredItems: store.favs.slice(0, 2500),
        customTranslations: store.customNotes,
        lastBookmark: store.bookmark,
        srs: store.srs,
        weakWords: store.weakWords,
        examHistory: store.examHistory,
        deletedItems: store.deletedItems,
        fieldUpdatedAt: store.fieldUpdatedAt,
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(this._db, 'user_data', this.user.uid), payload, { merge: true });
      this._setStatus('synced', `Synced as ${this.user.email || this.user.name}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Write rejected';
      this._setStatus('error', `Sync failed: ${msg}`);
    }
  }
}

export const cloudSync = new CloudSync();
