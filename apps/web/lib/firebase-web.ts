import { getFirebaseApp } from '@indasyatri/shared';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const app = getFirebaseApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
