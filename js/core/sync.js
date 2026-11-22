// @ts-check

/**
 * Muallim ul-Qur'an — Optional Firebase Auth & Firestore Sync (v6.0)
 * Lazy-loaded strictly when the user signs in (or resumes an opted-in session).
 * Syncs strictly to /user_data/{uid} with zero teacher/admin/broadcast paths.
 */

import { store, STORE_KEYS, lsGet, lsSet } from './store.js';

const FIREBASE_VER = '10.12.0';
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAjBnuLSADlXBZ7OY7daQ7mOta3VaHXVNg',
  authDomain: 'muallim-123.firebaseapp.com',
  projectId: 'muallim-123',
  storageBucket: 'muallim-123.firebasestorage.app',
  messagingSenderId: '226964645326',
  appId: '1:226964645326:web:0a219c95dad277b4cd379f'
};

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
   * @param {string} email
   */
  async sendPasswordReset(email) {
    await this.ensureLoaded();
    await this._fa.sendPasswordResetEmail(this._auth, email);
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
      const cloudFavs = Array.isArray(data.starredItems) ? data.starredItems : (Array.isArray(data.starred) ? data.starred : null);
      if (cloudFavs && cloudFavs.length > 0) {
        const mergedFavs = [...store.favs];
        for (const item of cloudFavs) {
          if (item && item.key && !mergedFavs.some(f => f.key === item.key)) {
            mergedFavs.push(item);
            changed = true;
          }
        }
        store.favs = mergedFavs;
        lsSet(STORE_KEYS.favs, JSON.stringify(store.favs));
      }

      const cloudNotes = data.customTranslations || data.customAnswers;
      if (cloudNotes && typeof cloudNotes === 'object') {
        store.customNotes = { ...cloudNotes, ...store.customNotes };
        lsSet(STORE_KEYS.customTranslations, JSON.stringify(store.customNotes));
        changed = true;
      }

      if (data.completedLessons && typeof data.completedLessons === 'object') {
        store.completedLessons = { ...data.completedLessons, ...store.completedLessons };
        lsSet(STORE_KEYS.completedLessons, JSON.stringify(store.completedLessons));
        changed = true;
      }

      if (data.studyLog && typeof data.studyLog === 'object') {
        const mergedLog = { ...data.studyLog };
        for (const [day, cnt] of Object.entries(store.studyLog)) {
          mergedLog[day] = Math.max(Number(mergedLog[day]) || 0, Number(cnt) || 0);
        }
        store.studyLog = mergedLog;
        lsSet(STORE_KEYS.studyLog, JSON.stringify(store.studyLog));
        changed = true;
      }

      if (data.streak && typeof data.streak === 'object') {
        const bestLongest = Math.max(Number(data.streak.longest) || 0, store.streak.longest || 0);
        const bestCurrent = (data.streak.lastStudyDate || '') > (store.streak.lastStudyDate || '')
          ? (Number(data.streak.current) || 0)
          : store.streak.current;
        store.streak = {
          current: bestCurrent,
          longest: bestLongest,
          lastStudyDate: (data.streak.lastStudyDate || '') > (store.streak.lastStudyDate || '')
            ? data.streak.lastStudyDate
            : store.streak.lastStudyDate
        };
        lsSet(STORE_KEYS.streak, JSON.stringify(store.streak));
        changed = true;
      }

      if (data.srs && typeof data.srs === 'object') {
        store.srs = { ...data.srs, ...store.srs };
        lsSet(STORE_KEYS.srs, JSON.stringify(store.srs));
        changed = true;
      }

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
