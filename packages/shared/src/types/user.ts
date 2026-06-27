import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  phone: string;
  whatsapp: string;
  role: 'user' | 'admin';
  tripsPosted: number;
  tripsCompleted: number;
  isBanned: boolean;
  preferredLang: 'en' | 'bn';
  preferredTheme: 'light' | 'dark' | 'system';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
