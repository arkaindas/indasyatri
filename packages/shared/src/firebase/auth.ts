import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  type UserCredential,
} from 'firebase/auth';
import { getFirebaseApp } from './config';

export function signInWithGoogle(): Promise<UserCredential> {
  const auth = getAuth(getFirebaseApp());
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  // Not async — signInWithPopup must be called synchronously within the
  // click handler to satisfy mobile browser popup-gesture requirements.
  return signInWithPopup(auth, provider);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getAuth(getFirebaseApp()));
}

export function subscribeToAuthState(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(getAuth(getFirebaseApp()), callback);
}

export function getCurrentUser(): FirebaseUser | null {
  return getAuth(getFirebaseApp()).currentUser;
}
