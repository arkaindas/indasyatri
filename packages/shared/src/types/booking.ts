import { Timestamp } from 'firebase/firestore';

export interface Booking {
  id: string;
  rideId: string;
  routeFrom: string;
  routeTo: string;
  date: string;
  passengerUid: string;
  passengerName: string;
  passengerPhone: string;
  seatsBooked: number;
  status: 'confirmed' | 'cancelled';
  bookedAt: Timestamp;
}
