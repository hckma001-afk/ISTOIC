// src/features/istok/services/istokIdentity.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
<<<<<<< HEAD

import {
  auth,
  db,
  googleProvider,
  firebaseSignInWithPopup,
  firebaseSignInWithRedirect,
  ensureAuthPersistence,
  signOut as firebaseSignOut,
} from '../../../services/firebaseConfig';

import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';

import {
  getRedirectResult,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
=======

import { auth, db, googleProvider } from "../../../services/firebaseConfig";

import { Capacitor } from "@capacitor/core";

import {
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
>>>>>>> codex/fix-app-for-android-installation-69ze6y

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
<<<<<<< HEAD
} from 'firebase/firestore';

import { debugService } from '../../../services/debugService';
=======
} from "firebase/firestore";

import { debugService } from "../../../services/debugService";
>>>>>>> codex/fix-app-for-android-installation-69ze6y

export interface IStokUserIdentity {
  uid: string;
  istokId: string;
  codename: string;
  email: string;
  displayName: string;
  photoURL: string;
  lastIdChange?: any;
  idChangeCount?: number;
}

function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

<<<<<<< HEAD
function friendlyAuthError(error: any): string {
  const errCode = error?.code || '';
  const errMsg = error?.message || String(error || '');

  // User cancel
  if (errCode === 'auth/popup-closed-by-user' || errMsg.includes('closed-by-user')) {
    return 'Login cancelled by user.';
  }

  // Popup blocked / COOP
  if (
    errCode === 'auth/popup-blocked' ||
    errMsg.includes('Cross-Origin-Opener-Policy') ||
    errMsg.includes('window.closed')
  ) {
    return 'Popup blocked by browser policy. Please allow popups or try another browser.';
  }

  // Unauthorized domain
  if (
    errCode === 'auth/unauthorized-domain' ||
    errMsg.includes('unauthorized-domain')
  ) {
    const currentDomain = window.location.hostname;
    return `Domain "${currentDomain}" unauthorized. Add it in Firebase Console → Auth → Settings → Authorized domains.`;
  }

  // Network fail
  if (errCode === 'auth/network-request-failed') {
    return 'Network connection failed. Please check your internet.';
  }

  // Generic
  return errMsg || 'Login failed.';
}

=======
async function ensureAuthPersistence(mode: "local" | "session" = "local") {
  if (!auth) return;
  const persistence = mode === "session" ? browserSessionPersistence : browserLocalPersistence;
  try {
    await setPersistence(auth, persistence);
  } catch (error) {
    console.warn("[ISTOK_AUTH] Failed to set auth persistence.", error);
  }
}

function friendlyAuthError(error: any): string {
  const errCode = error?.code || "";
  const errMsg = error?.message || String(error || "");

  // User cancel
  if (errCode === "auth/popup-closed-by-user" || errMsg.includes("closed-by-user")) {
    return "Login cancelled by user.";
  }

  // Popup blocked / COOP
  if (
    errCode === "auth/popup-blocked" ||
    errMsg.includes("Cross-Origin-Opener-Policy") ||
    errMsg.includes("window.closed")
  ) {
    return "Popup blocked by browser policy. Please allow popups or try another browser.";
  }

  // Unauthorized domain
  if (errCode === "auth/unauthorized-domain" || errMsg.includes("unauthorized-domain")) {
    const currentDomain = window.location.hostname;
    return `Domain "${currentDomain}" unauthorized. Add it in Firebase Console → Auth → Settings → Authorized domains.`;
  }

  // Network fail
  if (errCode === "auth/network-request-failed") {
    return "Network connection failed. Please check your internet.";
  }

  // Generic
  return errMsg || "Login failed.";
}

>>>>>>> codex/fix-app-for-android-installation-69ze6y
async function fetchProfile(uid: string): Promise<IStokUserIdentity | null> {
  if (!db) return null;
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return snap.data() as IStokUserIdentity;
}

<<<<<<< HEAD
function normalizeUser(user: User): Pick<IStokUserIdentity, 'uid'|'email'|'displayName'|'photoURL'> {
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'User'),
    photoURL: user.photoURL || '',
=======
function normalizeUser(user: User): Pick<IStokUserIdentity, "uid" | "email" | "displayName" | "photoURL"> {
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || (user.email ? user.email.split("@")[0] : "User"),
    photoURL: user.photoURL || "",
>>>>>>> codex/fix-app-for-android-installation-69ze6y
  };
}

export const IstokIdentityService = {
  /**
   * ✅ Login Google (AUTO):
   * - Web: Popup
   * - Native: Redirect (lebih stabil)
   *
   * Return:
   * - existing profile jika ada
   * - kalau user baru: object base (tanpa istokId/codename)
   *
   * IMPORTANT:
   * Untuk Native Redirect, proses complete-nya terjadi saat app balik.
<<<<<<< HEAD
   * `finalizeRedirectIfAny()` harus dipanggil di startup (index.tsx appUrlOpen sudah kamu pasang).
   */
  loginWithGoogle: async (): Promise<IStokUserIdentity> => {
    if (!auth) throw new Error('Firebase Configuration Missing in .env');
    if (!db) throw new Error('Firestore not initialized. Check Firebase config.');
=======
   * `finalizeRedirectIfAny()` harus dipanggil di startup.
   */
  loginWithGoogle: async (): Promise<IStokUserIdentity> => {
    if (!auth) throw new Error("Firebase Configuration Missing in .env");
    if (!db) throw new Error("Firestore not initialized. Check Firebase config.");
>>>>>>> codex/fix-app-for-android-installation-69ze6y

    await ensureAuthPersistence();

    try {
      if (isNative()) {
        // Native: Redirect
<<<<<<< HEAD
        await firebaseSignInWithRedirect(auth, googleProvider);
=======
        await signInWithRedirect(auth, googleProvider);
>>>>>>> codex/fix-app-for-android-installation-69ze6y

        // Setelah ini biasanya app akan pindah ke browser,
        // hasil login diambil saat balik (via getRedirectResult).
        // Kita throw khusus supaya UI bisa stop loading tanpa error.
<<<<<<< HEAD
        throw new Error('__REDIRECT_STARTED__');
      } else {
        // Web: Popup
        const result = await firebaseSignInWithPopup(auth, googleProvider);
=======
        throw new Error("__REDIRECT_STARTED__");
      } else {
        // Web: Popup
        const result = await signInWithPopup(auth, googleProvider);
>>>>>>> codex/fix-app-for-android-installation-69ze6y
        const user = result.user;

        const existing = await fetchProfile(user.uid);
        if (existing) return existing;

        // new user (needs setup)
        const base = normalizeUser(user);
        return {
          ...base,
<<<<<<< HEAD
          istokId: '',
          codename: '',
=======
          istokId: "",
          codename: "",
>>>>>>> codex/fix-app-for-android-installation-69ze6y
        };
      }
    } catch (err: any) {
      // Ini bukan error; hanya marker bahwa redirect dimulai
<<<<<<< HEAD
      if (String(err?.message || '') === '__REDIRECT_STARTED__') {
=======
      if (String(err?.message || "") === "__REDIRECT_STARTED__") {
>>>>>>> codex/fix-app-for-android-installation-69ze6y
        // biar caller bisa handle: jangan tampilkan error.
        throw err;
      }

      const msg = friendlyAuthError(err);
<<<<<<< HEAD
      debugService.log('ERROR', 'ISTOK_AUTH', 'LOGIN_FAIL', msg);
=======
      debugService.log("ERROR", "ISTOK_AUTH", "LOGIN_FAIL", msg);
>>>>>>> codex/fix-app-for-android-installation-69ze6y
      throw new Error(msg);
    }
  },

  /**
   * ✅ Dipanggil saat app balik dari redirect (Native).
   * Letakkan di handler appUrlOpen atau saat boot app.
   * Return: identity atau null jika tidak ada redirect result.
   */
  finalizeRedirectIfAny: async (): Promise<IStokUserIdentity | null> => {
    if (!auth || !db) return null;

    await ensureAuthPersistence();

    try {
      const result = await getRedirectResult(auth);
      if (!result?.user) return null;

      const user = result.user;
      const existing = await fetchProfile(user.uid);
      if (existing) return existing;

      const base = normalizeUser(user);
      return {
        ...base,
<<<<<<< HEAD
        istokId: '',
        codename: '',
=======
        istokId: "",
        codename: "",
>>>>>>> codex/fix-app-for-android-installation-69ze6y
      };
    } catch (err: any) {
      // Kalau tidak ada pending redirect, Firebase kadang throw.
      // Jangan bikin crash.
      const msg = friendlyAuthError(err);
<<<<<<< HEAD
      debugService.log('WARN', 'ISTOK_AUTH', 'REDIRECT_FINALIZE_FAIL', msg);
=======
      debugService.log("WARN", "ISTOK_AUTH", "REDIRECT_FINALIZE_FAIL", msg);
>>>>>>> codex/fix-app-for-android-installation-69ze6y
      return null;
    }
  },

  /**
   * ✅ Silent restore: cocok untuk AuthView kamu yang pakai onAuthStateChanged.
   * Biar rapi, kita bungkus.
   */
  watchAuthState: (cb: (user: User | null) => void) => {
    if (!auth) return () => {};
    return onAuthStateChanged(auth, cb);
  },

  // Save initial profile
  createProfile: async (identity: IStokUserIdentity) => {
    if (!db || !identity?.uid) return;

<<<<<<< HEAD
    await setDoc(doc(db, 'users', identity.uid), {
=======
    await setDoc(doc(db, "users", identity.uid), {
>>>>>>> codex/fix-app-for-android-installation-69ze6y
      ...identity,
      createdAt: serverTimestamp(),
      lastIdChange: serverTimestamp(),
      idChangeCount: 0,
    });

<<<<<<< HEAD
    localStorage.setItem('istok_user_identity', JSON.stringify(identity));
=======
    localStorage.setItem("istok_user_identity", JSON.stringify(identity));
>>>>>>> codex/fix-app-for-android-installation-69ze6y
  },

  // Update ID with Restrictions (2x per 30 days)
  updateCodename: async (
    uid: string,
    newCodename: string
  ): Promise<{ success: boolean; msg: string }> => {
<<<<<<< HEAD
    if (!db) return { success: false, msg: 'Database offline' };
=======
    if (!db) return { success: false, msg: "Database offline" };
>>>>>>> codex/fix-app-for-android-installation-69ze6y

    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return { success: false, msg: 'User not found' };

    const data: any = userSnap.data();
    const now = new Date();
    const lastChange = data.lastIdChange?.toDate ? data.lastIdChange.toDate() : new Date(0);

    const daysSince = (now.getTime() - lastChange.getTime()) / (1000 * 3600 * 24);
    let count = data.idChangeCount || 0;

    if (daysSince > 30) count = 0;

    if (count >= 2) {
      return {
        success: false,
        msg: `Limit reached. You can change ID again in ${Math.ceil(30 - daysSince)} days.`,
      };
    }

<<<<<<< HEAD
    const clean = newCodename.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
=======
    const clean = newCodename.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
>>>>>>> codex/fix-app-for-android-installation-69ze6y
    const newId = `ISTOIC-${clean}`;

    try {
      await updateDoc(userRef, {
        codename: clean,
        istokId: newId,
        lastIdChange: serverTimestamp(),
        idChangeCount: count + 1,
      });

      const newIdentity = { ...data, codename: clean, istokId: newId };
<<<<<<< HEAD
      localStorage.setItem('istok_user_identity', JSON.stringify(newIdentity));
=======
      localStorage.setItem("istok_user_identity", JSON.stringify(newIdentity));
>>>>>>> codex/fix-app-for-android-installation-69ze6y

      return { success: true, msg: 'ID Updated Successfully.' };
    } catch (e: any) {
<<<<<<< HEAD
      return { success: false, msg: e?.message || 'Update failed' };
=======
      return { success: false, msg: e?.message || "Update failed" };
>>>>>>> codex/fix-app-for-android-installation-69ze6y
    }
  },

  logout: async () => {
    if (auth) await firebaseSignOut(auth);
<<<<<<< HEAD
    localStorage.removeItem('istok_user_identity');
    localStorage.removeItem('bio_auth_enabled');
  },

  formatId: (rawName: string): string => {
    const clean = rawName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
=======
    localStorage.removeItem("istok_user_identity");
    localStorage.removeItem("bio_auth_enabled");
  },

  formatId: (rawName: string): string => {
    const clean = rawName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
>>>>>>> codex/fix-app-for-android-installation-69ze6y
    return `ISTOIC-${clean}`;
  },

  resolveId: (input: string): string => {
    const cleanInput = input.trim().toUpperCase();
<<<<<<< HEAD
    if (cleanInput.startsWith('ISTOIC-')) return cleanInput;
=======
    if (cleanInput.startsWith("ISTOIC-")) return cleanInput;
>>>>>>> codex/fix-app-for-android-installation-69ze6y
    return `ISTOIC-${cleanInput}`;
  },
};
