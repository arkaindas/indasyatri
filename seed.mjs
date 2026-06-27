/**
 * IndasYatri — Firebase Seed Script
 * Clears old data then seeds routes and rides for next 7 days.
 *
 * Usage:
 *   node seed.mjs
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

// ─── FIREBASE CONFIG ─────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDBg-0vX4ZS3wSev2G2JCY9We8XcREVUD4",
  authDomain: "indasyatri.firebaseapp.com",
  projectId: "indasyatri",
  storageBucket: "indasyatri.firebasestorage.app",
  messagingSenderId: "120216474792",
  appId: "1:120216474792:web:95c5d0e5c74f3f4c2a5e9d",
};

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

// ─── ROUTES ──────────────────────────────────────────────────────────────────
const ROUTES = [
  // ── Original routes ──
  { from: "Indas",     to: "Kolkata",      fromBn: "ইন্দাস",    toBn: "কলকাতা",    distance: "120 km", estimatedTime: "3 hours",   suggestedFareMin: 250, suggestedFareMax: 400 },
  { from: "Bankura",   to: "Kolkata",      fromBn: "বাঁকুড়া",   toBn: "কলকাতা",    distance: "230 km", estimatedTime: "5 hours",   suggestedFareMin: 400, suggestedFareMax: 600 },
  { from: "Bishnupur", to: "Kolkata",      fromBn: "বিষ্ণুপুর",  toBn: "কলকাতা",    distance: "200 km", estimatedTime: "4.5 hours", suggestedFareMin: 350, suggestedFareMax: 550 },
  { from: "Durgapur",  to: "Kolkata",      fromBn: "দুর্গাপুর",  toBn: "কলকাতা",    distance: "180 km", estimatedTime: "3.5 hours", suggestedFareMin: 300, suggestedFareMax: 500 },
  { from: "Indas",     to: "Bankura",      fromBn: "ইন্দাস",    toBn: "বাঁকুড়া",   distance: "45 km",  estimatedTime: "1.5 hours", suggestedFareMin: 100, suggestedFareMax: 200 },
  { from: "Bankura",   to: "Durgapur",     fromBn: "বাঁকুড়া",   toBn: "দুর্গাপুর",  distance: "80 km",  estimatedTime: "2 hours",   suggestedFareMin: 150, suggestedFareMax: 250 },
  { from: "Indas",     to: "Bishnupur",    fromBn: "ইন্দাস",    toBn: "বিষ্ণুপুর",  distance: "35 km",  estimatedTime: "1 hour",    suggestedFareMin: 80,  suggestedFareMax: 150 },
  { from: "Bishnupur", to: "Durgapur",     fromBn: "বিষ্ণুপুর",  toBn: "দুর্গাপুর",  distance: "90 km",  estimatedTime: "2.5 hours", suggestedFareMin: 150, suggestedFareMax: 280 },
  // ── New routes ──
  { from: "Indas",     to: "Burdwan",      fromBn: "ইন্দাস",    toBn: "বর্ধমান",    distance: "90 km",  estimatedTime: "2.5 hours", suggestedFareMin: 150, suggestedFareMax: 280 },
  { from: "Burdwan",   to: "Kolkata",      fromBn: "বর্ধমান",    toBn: "কলকাতা",    distance: "100 km", estimatedTime: "2.5 hours", suggestedFareMin: 200, suggestedFareMax: 350 },
  { from: "Asansol",   to: "Kolkata",      fromBn: "আসানসোল",   toBn: "কলকাতা",    distance: "200 km", estimatedTime: "4 hours",   suggestedFareMin: 350, suggestedFareMax: 550 },
  { from: "Asansol",   to: "Durgapur",     fromBn: "আসানসোল",   toBn: "দুর্গাপুর",  distance: "40 km",  estimatedTime: "1 hour",    suggestedFareMin: 80,  suggestedFareMax: 150 },
  { from: "Arambagh",  to: "Kolkata",      fromBn: "আরামবাগ",   toBn: "কলকাতা",    distance: "100 km", estimatedTime: "2.5 hours", suggestedFareMin: 200, suggestedFareMax: 350 },
  { from: "Arambagh",  to: "Karunamoyee",  fromBn: "আরামবাগ",   toBn: "করুণাময়ী",  distance: "20 km",  estimatedTime: "45 mins",   suggestedFareMin: 60,  suggestedFareMax: 120 },
  { from: "Kotulpur",  to: "Kolkata",      fromBn: "কোতুলপুর",  toBn: "কলকাতা",    distance: "130 km", estimatedTime: "3 hours",   suggestedFareMin: 250, suggestedFareMax: 400 },
  { from: "Kotulpur",  to: "Bankura",      fromBn: "কোতুলপুর",  toBn: "বাঁকুড়া",   distance: "35 km",  estimatedTime: "1 hour",    suggestedFareMin: 80,  suggestedFareMax: 150 },
  { from: "Kotulpur",  to: "Bishnupur",    fromBn: "কোতুলপুর",  toBn: "বিষ্ণুপুর",  distance: "25 km",  estimatedTime: "45 mins",   suggestedFareMin: 60,  suggestedFareMax: 120 },
  { from: "Burdwan",   to: "Durgapur",     fromBn: "বর্ধমান",    toBn: "দুর্গাপুর",  distance: "50 km",  estimatedTime: "1.5 hours", suggestedFareMin: 100, suggestedFareMax: 180 },
  { from: "Burdwan",   to: "Asansol",      fromBn: "বর্ধমান",    toBn: "আসানসোল",   distance: "60 km",  estimatedTime: "1.5 hours", suggestedFareMin: 120, suggestedFareMax: 200 },
  { from: "Karunamoyee", to: "Kolkata",    fromBn: "করুণাময়ী",  toBn: "কলকাতা",    distance: "15 km",  estimatedTime: "45 mins",   suggestedFareMin: 50,  suggestedFareMax: 100 },
  { from: "Indas",     to: "Arambagh",     fromBn: "ইন্দাস",    toBn: "আরামবাগ",   distance: "30 km",  estimatedTime: "1 hour",    suggestedFareMin: 70,  suggestedFareMax: 130 },
];

// ─── SAMPLE DRIVERS ──────────────────────────────────────────────────────────
const DRIVERS = [
  { uid: "seed_driver_001", name: "Raju Mondal",   phone: "9832100001", whatsapp: "9832100001", photoURL: "https://api.dicebear.com/7.x/thumbs/svg?seed=raju" },
  { uid: "seed_driver_002", name: "Suresh Das",    phone: "9832100002", whatsapp: "9832100002", photoURL: "https://api.dicebear.com/7.x/thumbs/svg?seed=suresh" },
  { uid: "seed_driver_003", name: "Amit Ghosh",    phone: "9832100003", whatsapp: "9832100003", photoURL: "https://api.dicebear.com/7.x/thumbs/svg?seed=amit" },
  { uid: "seed_driver_004", name: "Bikash Soren",  phone: "9832100004", whatsapp: "9832100004", photoURL: "https://api.dicebear.com/7.x/thumbs/svg?seed=bikash" },
  { uid: "seed_driver_005", name: "Prasanta Roy",  phone: "9832100005", whatsapp: "9832100005", photoURL: "https://api.dicebear.com/7.x/thumbs/svg?seed=prasanta" },
];

// ─── VEHICLES ────────────────────────────────────────────────────────────────
const VEHICLES = [
  { type: "SUV",      model: "Mahindra Bolero",     number: "WB 26 X 1234" },
  { type: "Sedan",    model: "Maruti Swift Dzire",  number: "WB 28 Y 5678" },
  { type: "SUV",      model: "Mahindra Scorpio",    number: "WB 26 Z 9012" },
  { type: "MUV/MPV", model: "Maruti Ertiga",        number: "WB 27 A 3456" },
  { type: "Hatchback", model: "Maruti WagonR",      number: "WB 29 B 7890" },
  { type: "SUV",      model: "Hyundai Creta",       number: "WB 26 C 2345" },
  { type: "MUV/MPV", model: "Toyota Innova",        number: "WB 28 D 6789" },
  { type: "Sedan",    model: "Hyundai Aura",        number: "WB 27 E 0123" },
];

// ─── DEPARTURE TIMES ─────────────────────────────────────────────────────────
const TIMES = ["06:00", "07:30", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];

// ─── NOTES POOL ──────────────────────────────────────────────────────────────
const NOTES_POOL = [
  "AC available",
  "Pickup from bus stand",
  "Music allowed",
  "No smoking",
  "Pickup from main road only",
  "Ladies friendly",
  "Luggage space available",
  "AC available, comfortable ride",
  "",
  "",
  "",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getDateString(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

function slugId(str) {
  return str.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

// ─── CLEAR OLD DATA ───────────────────────────────────────────────────────────
async function clearOldData() {
  console.log("\n🗑️  Clearing old routes and rides...");

  const routeSnap = await getDocs(collection(db, "routes"));
  for (const d of routeSnap.docs) await deleteDoc(d.ref);
  console.log(`  Deleted ${routeSnap.size} old routes`);

  const rideSnap = await getDocs(collection(db, "rides"));
  for (const d of rideSnap.docs) await deleteDoc(d.ref);
  console.log(`  Deleted ${rideSnap.size} old rides`);
}

// ─── SEED ROUTES ─────────────────────────────────────────────────────────────
async function seedRoutes() {
  console.log("\n📍 Seeding routes...");
  const createdRouteIds = {};

  for (const route of ROUTES) {
    const fwdId = `route_${slugId(route.from)}_${slugId(route.to)}`;
    const pairId = `pair_${slugId(route.from)}_${slugId(route.to)}`;

    await setDoc(doc(db, "routes", fwdId), {
      id: fwdId,
      from: route.from,
      to: route.to,
      fromBn: route.fromBn,
      toBn: route.toBn,
      status: "approved",
      submittedBy: null,
      submittedByName: null,
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      suggestedFareMin: route.suggestedFareMin,
      suggestedFareMax: route.suggestedFareMax,
      isActive: true,
      rideCount: 0,
      pairId,
      createdAt: Timestamp.now(),
    });
    console.log(`  ✅ ${route.from} → ${route.to} (${fwdId})`);
    createdRouteIds[`${route.from}_${route.to}`] = fwdId;

    const revId = `route_${slugId(route.to)}_${slugId(route.from)}`;
    await setDoc(doc(db, "routes", revId), {
      id: revId,
      from: route.to,
      to: route.from,
      fromBn: route.toBn,
      toBn: route.fromBn,
      status: "approved",
      submittedBy: null,
      submittedByName: null,
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      suggestedFareMin: route.suggestedFareMin,
      suggestedFareMax: route.suggestedFareMax,
      isActive: true,
      rideCount: 0,
      pairId,
      createdAt: Timestamp.now(),
    });
    console.log(`  ✅ ${route.to} → ${route.from} (${revId})`);
    createdRouteIds[`${route.to}_${route.from}`] = revId;
  }

  return createdRouteIds;
}

// ─── SEED DRIVERS ─────────────────────────────────────────────────────────────
async function seedDrivers() {
  console.log("\n👤 Seeding sample drivers...");
  for (const driver of DRIVERS) {
    await setDoc(doc(db, "users", driver.uid), {
      uid: driver.uid,
      name: driver.name,
      email: `${slugId(driver.name)}@seed.indasyatri.app`,
      photoURL: driver.photoURL,
      phone: driver.phone,
      whatsapp: driver.whatsapp,
      role: "user",
      tripsPosted: 0,
      tripsCompleted: 0,
      isBanned: false,
      preferredLang: "en",
      preferredTheme: "light",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log(`  ✅ Driver: ${driver.name}`);
  }
}

// ─── SEED RIDES ──────────────────────────────────────────────────────────────
async function seedRides(routeIds) {
  console.log("\n🚗 Seeding rides for next 7 days...");
  let totalRides = 0;

  const allRoutes = [
    ...ROUTES.map(r => ({ from: r.from, to: r.to, fareMin: r.suggestedFareMin, fareMax: r.suggestedFareMax })),
    ...ROUTES.map(r => ({ from: r.to, to: r.from, fareMin: r.suggestedFareMin, fareMax: r.suggestedFareMax })),
  ];

  for (const route of allRoutes) {
    const routeId = routeIds[`${route.from}_${route.to}`];
    if (!routeId) continue;

    const ridesPerRoute = Math.floor(Math.random() * 2) + 3; // 3 or 4
    const usedDays = new Set();

    for (let r = 0; r < ridesPerRoute; r++) {
      let day;
      // +1 ensures tomorrow onwards (never today)
      do { day = Math.floor(Math.random() * 7) + 1; } while (usedDays.has(day));
      usedDays.add(day);

      const driver = randomFrom(DRIVERS);
      const vehicle = randomFrom(VEHICLES);
      const time = randomFrom(TIMES);
      const totalSeats = Math.floor(Math.random() * 3) + 2; // 2-4
      const bookedSeats = Math.floor(Math.random() * (totalSeats - 1));
      const availableSeats = totalSeats - bookedSeats;
      const fare = route.fareMin + Math.floor(Math.random() * (route.fareMax - route.fareMin));
      const roundedFare = Math.round(fare / 10) * 10;
      const dateStr = getDateString(day);
      const note = randomFrom(NOTES_POOL);

      const rideId = `ride_${slugId(route.from)}_${slugId(route.to)}_${dateStr}_${time.replace(":", "")}_${driver.uid.slice(-3)}`;

      await setDoc(doc(db, "rides", rideId), {
        id: rideId,
        routeId,
        routeFrom: route.from,
        routeTo: route.to,
        driverUid: driver.uid,
        driverName: driver.name,
        driverPhoto: driver.photoURL,
        driverPhone: driver.phone,
        driverWhatsapp: driver.whatsapp,
        date: dateStr,
        departureTime: time,
        totalSeats,
        availableSeats,
        pricePerSeat: roundedFare,
        vehicleType: vehicle.type,
        vehicleModel: vehicle.model,
        vehicleNumber: vehicle.number,
        notes: note,
        status: availableSeats === 0 ? "full" : "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      console.log(`  ✅ ${route.from} → ${route.to} | ${dateStr} ${time} | ${driver.name} | ${vehicle.model} | ₹${roundedFare} | ${availableSeats}/${totalSeats} seats`);
      totalRides++;
    }
  }

  return totalRides;
}

// ─── SEED SETTINGS ───────────────────────────────────────────────────────────
async function seedSettings() {
  console.log("\n⚙️  Seeding app settings...");
  await setDoc(doc(db, "settings", "general"), {
    upcomingRideDays: 7,
    maxSeatsPerRide: 7,
    appName: "IndasYatri",
    maintenanceMode: false,
  });
  console.log("  ✅ Settings saved");
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 IndasYatri Seed Script Starting...");
  console.log("📡 Connecting to Firebase...");

  try {
    await clearOldData();
    const routeIds = await seedRoutes();
    await seedDrivers();
    const totalRides = await seedRides(routeIds);
    await seedSettings();

    console.log("\n✨ Seed complete!");
    console.log(`   Routes created : ${ROUTES.length * 2} (${ROUTES.length} forward + ${ROUTES.length} reverse)`);
    console.log(`   Drivers created: ${DRIVERS.length}`);
    console.log(`   Rides created  : ${totalRides}`);
    console.log("\n🌐 Visit your app and check the homepage — rides should appear!");
    console.log("👉 Next: Go to Firestore → users → find YOUR document → set role to 'admin'");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Seed failed:", err.message);
    console.error(err);
    process.exit(1);
  }
}

main();
