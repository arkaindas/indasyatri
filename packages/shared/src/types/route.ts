import { Timestamp } from 'firebase/firestore';

export interface Route {
  id: string;
  from: string;
  to: string;
  fromBn: string;
  toBn: string;
  status: 'approved' | 'pending' | 'rejected';
  submittedBy: string | null;
  submittedByName: string | null;
  distance: string;
  estimatedTime: string;
  suggestedFareMin: number;
  suggestedFareMax: number;
  isActive: boolean;
  rideCount: number;
  pairId?: string;
  createdAt: Timestamp;
}
