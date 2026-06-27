import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  increment,
  serverTimestamp,
  type QuerySnapshot,
  type DocumentData,
  type Timestamp,
} from 'firebase/firestore';
import { getFirebaseApp } from './config';
import type { User } from '../types/user';
import type { Route } from '../types/route';
import type { Ride } from '../types/ride';
import type { Booking } from '../types/booking';
import type { RideAlert } from '../types/alert';
import type { AppSettings } from '../types/settings';

function db() {
  return getFirestore(getFirebaseApp());
}

function tsMillis(ts: unknown): number {
  if (ts && typeof (ts as Timestamp).toMillis === 'function') {
    return (ts as Timestamp).toMillis();
  }
  return 0;
}

// ── Users ──────────────────────────────────────────────────────────────────

export async function createOrUpdateUser(
  uid: string,
  data: Partial<User>
): Promise<void> {
  const ref = doc(db(), 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      name: '',
      email: '',
      photoURL: '',
      phone: '',
      whatsapp: '',
      role: 'user',
      tripsPosted: 0,
      tripsCompleted: 0,
      isBanned: false,
      preferredLang: 'en',
      preferredTheme: 'system',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...data,
    });
  } else {
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }
}

export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db(), 'users', uid));
  return snap.exists() ? (snap.data() as unknown as User) : null;
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  await updateDoc(doc(db(), 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function getAllUsers(): Promise<User[]> {
  const snap = await getDocs(collection(db(), 'users'));
  return snap.docs.map((d) => ({ ...d.data(), uid: d.id }) as unknown as User);
}

export async function banUser(uid: string, banned: boolean): Promise<void> {
  await updateDoc(doc(db(), 'users', uid), { isBanned: banned });
}

// ── Routes ─────────────────────────────────────────────────────────────────

export async function getApprovedRoutes(): Promise<Route[]> {
  const q = query(
    collection(db(), 'routes'),
    where('status', '==', 'approved'),
    where('isActive', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Route));
}

export async function getAllRoutes(): Promise<Route[]> {
  const snap = await getDocs(collection(db(), 'routes'));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Route));
}

export async function getPendingRoutes(): Promise<Route[]> {
  // No orderBy — avoids composite index requirement. Sort client-side.
  const q = query(collection(db(), 'routes'), where('status', '==', 'pending'));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ ...d.data(), id: d.id } as Route))
    .sort((a, b) => tsMillis(b.createdAt) - tsMillis(a.createdAt));
}

export async function suggestRoute(
  data: Omit<Route, 'id' | 'createdAt' | 'status' | 'rideCount' | 'isActive'>
): Promise<string> {
  const ref = await addDoc(collection(db(), 'routes'), {
    ...data,
    status: 'pending',
    rideCount: 0,
    isActive: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function approveRoute(routeId: string, route: Route): Promise<void> {
  const pairId = `${routeId}_pair`;

  await updateDoc(doc(db(), 'routes', routeId), {
    status: 'approved',
    isActive: true,
    pairId,
  });

  await addDoc(collection(db(), 'routes'), {
    from: route.to,
    to: route.from,
    fromBn: route.toBn,
    toBn: route.fromBn,
    status: 'approved',
    submittedBy: null,
    submittedByName: null,
    distance: route.distance,
    estimatedTime: route.estimatedTime,
    suggestedFareMin: route.suggestedFareMin,
    suggestedFareMax: route.suggestedFareMax,
    isActive: true,
    rideCount: 0,
    pairId,
    createdAt: serverTimestamp(),
  });
}

export async function rejectRoute(routeId: string): Promise<void> {
  await updateDoc(doc(db(), 'routes', routeId), { status: 'rejected' });
}

export async function addRoute(
  data: Omit<Route, 'id' | 'createdAt' | 'rideCount'>
): Promise<string> {
  const pairId = `admin_${Date.now()}`;

  const ref = await addDoc(collection(db(), 'routes'), {
    ...data,
    rideCount: 0,
    createdAt: serverTimestamp(),
    pairId,
  });

  await addDoc(collection(db(), 'routes'), {
    from: data.to,
    to: data.from,
    fromBn: data.toBn,
    toBn: data.fromBn,
    status: data.status,
    submittedBy: null,
    submittedByName: null,
    distance: data.distance,
    estimatedTime: data.estimatedTime,
    suggestedFareMin: data.suggestedFareMin,
    suggestedFareMax: data.suggestedFareMax,
    isActive: data.isActive,
    rideCount: 0,
    pairId,
    createdAt: serverTimestamp(),
  });

  return ref.id;
}

export async function updateRoute(routeId: string, data: Partial<Route>): Promise<void> {
  await updateDoc(doc(db(), 'routes', routeId), data);
}

export async function seedRoutes(
  seeds: Array<{
    from: string; to: string; fromBn: string; toBn: string;
    distance: string; estimatedTime: string;
    suggestedFareMin: number; suggestedFareMax: number;
  }>
): Promise<void> {
  for (const seed of seeds) {
    await addDoc(collection(db(), 'routes'), {
      ...seed,
      status: 'approved',
      submittedBy: null,
      submittedByName: null,
      isActive: true,
      rideCount: 0,
      createdAt: serverTimestamp(),
    });
  }
}

// ── Rides ──────────────────────────────────────────────────────────────────

export async function getUpcomingRides(
  todayStr: string,
  maxDateStr: string
): Promise<Ride[]> {
  // Single-field where avoids composite index. Filter dates client-side.
  const q = query(collection(db(), 'rides'), where('status', '==', 'active'));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ ...d.data(), id: d.id } as Ride))
    .filter((r) => r.date >= todayStr && r.date <= maxDateStr)
    .sort((a, b) => a.date.localeCompare(b.date) || a.departureTime.localeCompare(b.departureTime));
}

export async function searchRides(
  from: string,
  to: string,
  date: string
): Promise<Ride[]> {
  const q = query(
    collection(db(), 'rides'),
    where('routeFrom', '==', from),
    where('routeTo', '==', to)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ ...d.data(), id: d.id } as unknown as Ride))
    .filter((r) => r.date === date && r.status !== 'cancelled')
    .sort((a, b) => a.departureTime.localeCompare(b.departureTime));
}

export async function getRide(rideId: string): Promise<Ride | null> {
  const snap = await getDoc(doc(db(), 'rides', rideId));
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as Ride) : null;
}

export async function getDriverRides(driverUid: string): Promise<Ride[]> {
  // No orderBy — avoids composite index. Sort by date+time client-side.
  const q = query(collection(db(), 'rides'), where('driverUid', '==', driverUid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ ...d.data(), id: d.id } as Ride))
    .sort((a, b) => (b.date + b.departureTime).localeCompare(a.date + a.departureTime));
}

export async function getAllRides(): Promise<Ride[]> {
  const q = query(collection(db(), 'rides'), orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Ride));
}

export async function postRide(
  data: Omit<Ride, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const ref = await addDoc(collection(db(), 'rides'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Increment driver tripsPosted. User is allowed to update their own doc.
  await updateDoc(doc(db(), 'users', data.driverUid), {
    tripsPosted: increment(1),
  });

  // NOTE: rideCount on routes is NOT incremented here because Firestore
  // security rules only allow admins to update route documents.
  // Route stats are visible in the admin panel via getAllRides().

  return ref.id;
}

export async function updateRideStatus(
  rideId: string,
  status: Ride['status']
): Promise<void> {
  await updateDoc(doc(db(), 'rides', rideId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function updateRide(rideId: string, data: Partial<Ride>): Promise<void> {
  await updateDoc(doc(db(), 'rides', rideId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ── Bookings ───────────────────────────────────────────────────────────────

export async function createBooking(
  data: Omit<Booking, 'id' | 'bookedAt'>
): Promise<string> {
  const ref = await addDoc(collection(db(), 'bookings'), {
    ...data,
    bookedAt: serverTimestamp(),
  });

  await updateDoc(doc(db(), 'rides', data.rideId), {
    availableSeats: increment(-data.seatsBooked),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

export async function getPassengerBookings(passengerUid: string): Promise<Booking[]> {
  // No orderBy — avoids composite index. Sort by timestamp client-side.
  const q = query(collection(db(), 'bookings'), where('passengerUid', '==', passengerUid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ ...d.data(), id: d.id } as Booking))
    .sort((a, b) => tsMillis(b.bookedAt) - tsMillis(a.bookedAt));
}

export async function getRideBookings(rideId: string): Promise<Booking[]> {
  const q = query(
    collection(db(), 'bookings'),
    where('rideId', '==', rideId),
    where('status', '==', 'confirmed')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Booking));
}

export async function cancelBooking(bookingId: string, rideId: string, seats: number): Promise<void> {
  await updateDoc(doc(db(), 'bookings', bookingId), { status: 'cancelled' });
  await updateDoc(doc(db(), 'rides', rideId), {
    availableSeats: increment(seats),
    updatedAt: serverTimestamp(),
  });
}

// ── Alerts ─────────────────────────────────────────────────────────────────

export async function createAlert(
  data: Omit<RideAlert, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(collection(db(), 'alerts'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserAlerts(userUid: string): Promise<RideAlert[]> {
  const q = query(
    collection(db(), 'alerts'),
    where('userUid', '==', userUid),
    where('isActive', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as RideAlert));
}

export async function deleteAlert(alertId: string): Promise<void> {
  await updateDoc(doc(db(), 'alerts', alertId), { isActive: false });
}

export async function getMatchingAlerts(
  routeId: string,
  date: string
): Promise<RideAlert[]> {
  const q = query(
    collection(db(), 'alerts'),
    where('routeId', '==', routeId),
    where('isActive', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ ...d.data(), id: d.id } as RideAlert))
    .filter((a) => a.targetDate === date || a.targetDate === 'any');
}

// ── Settings ───────────────────────────────────────────────────────────────

export async function getSettings(): Promise<AppSettings> {
  const snap = await getDoc(doc(db(), 'settings', 'general'));
  if (!snap.exists()) {
    return {
      upcomingRideDays: 7,
      maxSeatsPerRide: 7,
      appName: 'IndasYatri',
      maintenanceMode: false,
    };
  }
  return snap.data() as AppSettings;
}

export async function updateSettings(data: Partial<AppSettings>): Promise<void> {
  await setDoc(doc(db(), 'settings', 'general'), data, { merge: true });
}

export function subscribeToUpcomingRides(
  todayStr: string,
  maxDateStr: string,
  callback: (rides: Ride[]) => void
): () => void {
  // Single-field where avoids composite index. Filter/sort client-side.
  const q = query(collection(db(), 'rides'), where('status', '==', 'active'));
  return onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
    const rides = snap.docs
      .map((d) => ({ ...d.data(), id: d.id } as Ride))
      .filter((r) => r.date >= todayStr && r.date <= maxDateStr)
      .sort((a, b) => a.date.localeCompare(b.date) || a.departureTime.localeCompare(b.departureTime));
    callback(rides);
  });
}
