// Types
export * from './types';

// Constants
export { VEHICLE_DATA, VEHICLE_TYPES } from './constants/vehicles';
export { SEED_ROUTES } from './constants/routes';
export { DEFAULT_SETTINGS } from './constants/defaults';

// i18n
export { t, getLang } from './i18n';
export type { Lang } from './i18n';

// Utils
export { generateWhatsAppLink } from './utils/whatsapp';
export { generateCallLink } from './utils/phone';
export { formatDate, formatTime, todayString, addDays } from './utils/date';
export {
  isValidPhone,
  isValidVehicleNumber,
  isValidPrice,
  isValidSeats,
  isDateInFuture,
} from './utils/validation';

// Firebase
export { getFirebaseApp } from './firebase/config';
export { signInWithGoogle, signOut, subscribeToAuthState, getCurrentUser, getRedirectSignInResult } from './firebase/auth';
export * from './firebase/firestore';
export { requestNotificationPermission, onForegroundMessage } from './firebase/fcm';
