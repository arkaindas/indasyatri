import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { getFirebaseApp } from './config';

function isMobileBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const mobile = isMobileBrowser();

  console.log('[auth] signInWithGoogle — isMobile:', mobile);

  try {
    if (mobile) {
      console.log('[auth] using signInWithRedirect...');
      await signInWithRedirect(auth, provider);
      return null;
    }

    console.log('[auth] using signInWithPopup...');
    const result = await signInWithPopup(auth, provider);
    console.log('[auth] popup success:', result.user.email);
    return result.user;
  } catch (err) {
    console.error('[auth] signInWithGoogle error:', err);
    throw err;
  }
}

export async function getRedirectSignInResult(): Promise<FirebaseUser | null> {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  const result = await getRedirectResult(auth);
  return result?.user ?? null;
}

export async function signOut(): Promise<void> {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  await firebaseSignOut(auth);
}

export function subscribeToAuthState(
  callback: (user: FirebaseUser | null) => void
): () => void {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): FirebaseUser | null {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  return auth.currentUser;
}
