import { Timestamp } from 'firebase/firestore';

export interface Ride {
  id: string;
  routeId: string;
  routeFrom: string;
  routeTo: string;
  driverUid: string;
  driverName: string;
  driverPhoto: string;
  driverPhone: string;
  driverWhatsapp: string;
  date: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  vehicleType: string;
  vehicleModel: string;
  vehicleNumber: string;
  notes: string;
  status: 'active' | 'full' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
