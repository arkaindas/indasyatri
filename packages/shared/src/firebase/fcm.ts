import { getMessaging, getToken, onMessage, type MessagePayload } from 'firebase/messaging';
import { getFirebaseApp } from './config';

export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  if (!('Notification' in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  try {
    const app = getFirebaseApp();
    const messaging = getMessaging(app);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch {
    return null;
  }
}

export function onForegroundMessage(
  callback: (payload: MessagePayload) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  try {
    const app = getFirebaseApp();
    const messaging = getMessaging(app);
    return onMessage(messaging, callback);
  } catch {
    return () => {};
  }
}
