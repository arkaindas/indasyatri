import { Timestamp } from 'firebase/firestore';

export interface RideAlert {
  id: string;
  userUid: string;
  userName: string;
  routeId: string;
  routeFrom: string;
  routeTo: string;
  targetDate: string;
  isActive: boolean;
  fcmToken: string;
  createdAt: Timestamp;
}
