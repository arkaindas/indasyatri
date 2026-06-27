# CLAUDE.md — IndasYatri (ইন্দাসযাত্রী)

## Project Overview

IndasYatri is a hyperlocal cab/ride-sharing platform for small towns and rural areas in West Bengal, India. It connects private car owners who travel between towns (e.g., Indus → Kolkata) with passengers looking for affordable shared rides. No in-app payments — passengers connect with drivers via WhatsApp or phone call and settle with cash/UPI directly.

**App Name:** IndasYatri (ইন্দাসযাত্রী)
**Tagline:** "Share rides, save money, travel together" / "একসাথে যাত্রা, খরচ বাঁচান"

---

## Architecture & Monorepo Structure

This is a **monorepo** designed for code sharing between web (Next.js) and future mobile (Expo React Native Android APK). All Firebase logic, types, constants, and utilities live in a shared package.

```
indasyatri/
├── CLAUDE.md
├── package.json                  # Root workspace config
├── packages/
│   └── shared/                   # Shared code between web & mobile
│       ├── package.json
│       ├── src/
│       │   ├── firebase/
│       │   │   ├── config.ts          # Firebase init (reads env vars)
│       │   │   ├── auth.ts            # Google sign-in, sign-out, onAuthStateChanged
│       │   │   ├── firestore.ts       # All Firestore read/write functions
│       │   │   ├── fcm.ts             # Firebase Cloud Messaging helpers
│       │   │   └── rules.ts           # Reference: security rules (not executed)
│       │   ├── types/
│       │   │   ├── index.ts           # All TypeScript interfaces/types
│       │   │   ├── ride.ts
│       │   │   ├── route.ts
│       │   │   ├── user.ts
│       │   │   ├── booking.ts
│       │   │   ├── alert.ts
│       │   │   └── settings.ts
│       │   ├── constants/
│       │   │   ├── vehicles.ts        # Vehicle types, models, dropdown data
│       │   │   ├── routes.ts          # Seed route data
│       │   │   └── defaults.ts        # Default settings values
│       │   ├── i18n/
│       │   │   ├── en.json            # English translations
│       │   │   ├── bn.json            # Bengali translations
│       │   │   └── index.ts           # i18n utility (getLang, t function)
│       │   └── utils/
│       │       ├── whatsapp.ts        # WhatsApp deeplink generator
│       │       ├── phone.ts           # tel: link generator
│       │       ├── date.ts            # Date formatting, relative dates
│       │       └── validation.ts      # Form validation helpers
│       └── tsconfig.json
├── apps/
│   └── web/                      # Next.js 14 App Router
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── .env.local.example
│       ├── public/
│       │   ├── logo.svg
│       │   └── og-image.png
│       ├── app/
│       │   ├── layout.tsx             # Root layout (theme, lang, auth providers)
│       │   ├── page.tsx               # Homepage
│       │   ├── search/
│       │   │   └── page.tsx           # Find a Ride (search + results)
│       │   ├── offer/
│       │   │   └── page.tsx           # Offer a Ride form
│       │   ├── ride/
│       │   │   └── [id]/
│       │   │       └── page.tsx       # Single ride detail page
│       │   ├── profile/
│       │   │   └── page.tsx           # User profile (phone, WhatsApp, my rides)
│       │   ├── my-rides/
│       │   │   └── page.tsx           # Driver's posted rides management
│       │   ├── my-bookings/
│       │   │   └── page.tsx           # Passenger's booking history
│       │   ├── suggest-route/
│       │   │   └── page.tsx           # Suggest new route form
│       │   ├── alerts/
│       │   │   └── page.tsx           # Manage ride alert subscriptions
│       │   └── admin/
│       │       ├── page.tsx           # Admin dashboard (stats overview)
│       │       ├── routes/
│       │       │   └── page.tsx       # Route management (approve/reject/add)
│       │       ├── rides/
│       │       │   └── page.tsx       # All rides overview
│       │       ├── users/
│       │       │   └── page.tsx       # User management (ban/unban)
│       │       └── settings/
│       │           └── page.tsx       # App settings (upcoming days, fares)
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.tsx         # Logo, nav, lang toggle, theme toggle, auth
│       │   │   ├── Footer.tsx
│       │   │   ├── MobileNav.tsx      # Bottom navigation for mobile
│       │   │   └── AdminSidebar.tsx
│       │   ├── auth/
│       │   │   ├── AuthProvider.tsx    # Context provider for auth state
│       │   │   ├── LoginButton.tsx    # Google sign-in button
│       │   │   └── ProtectedRoute.tsx # Redirect if not logged in
│       │   ├── rides/
│       │   │   ├── RideCard.tsx       # Single ride display card
│       │   │   ├── RideList.tsx       # List of ride cards grouped by date
│       │   │   ├── RideSearchForm.tsx # Route + date picker search
│       │   │   ├── RidePostForm.tsx   # Offer a ride form
│       │   │   └── VehicleSelect.tsx  # Cascading vehicle type → model dropdown
│       │   ├── routes/
│       │   │   ├── RouteChips.tsx     # Popular routes display
│       │   │   ├── RouteSuggestForm.tsx
│       │   │   └── RouteAdminList.tsx # Admin route approval list
│       │   ├── alerts/
│       │   │   ├── AlertSubscribeForm.tsx
│       │   │   └── AlertList.tsx
│       │   ├── ui/
│       │   │   ├── NeuCard.tsx        # Neumorphic card component
│       │   │   ├── NeuButton.tsx      # Neumorphic button
│       │   │   ├── NeuInput.tsx       # Neumorphic input field
│       │   │   ├── NeuSelect.tsx      # Neumorphic dropdown
│       │   │   ├── NeuBadge.tsx       # Status badges
│       │   │   ├── NeuToggle.tsx      # Toggle switch
│       │   │   ├── ThemeToggle.tsx    # Dark/light mode switch
│       │   │   ├── LangToggle.tsx     # EN/BN language switch
│       │   │   ├── WhatsAppButton.tsx # Green WhatsApp CTA
│       │   │   └── CallButton.tsx     # Phone call CTA
│       │   └── common/
│       │       ├── DateGroupHeader.tsx # "Tomorrow, July 24" labels
│       │       ├── EmptyState.tsx
│       │       ├── LoadingSpinner.tsx
│       │       └── Toast.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useRides.ts
│       │   ├── useRoutes.ts
│       │   ├── useAlerts.ts
│       │   ├── useSettings.ts
│       │   ├── useTheme.ts
│       │   └── useLang.ts
│       ├── context/
│       │   ├── AuthContext.tsx
│       │   ├── ThemeContext.tsx
│       │   └── LangContext.tsx
│       └── lib/
│           └── firebase-web.ts        # Web-specific Firebase init (imports from shared)
│
│   # FUTURE — do not build now, structure is documented for reference
│   └── mobile/                   # Expo React Native (Phase 2)
│       ├── package.json
│       ├── app.json / app.config.ts
│       ├── eas.json
│       ├── app/                  # Expo Router (file-based routing)
│       │   ├── (tabs)/
│       │   │   ├── index.tsx     # Home (Find a Ride)
│       │   │   ├── offer.tsx     # Offer a Ride
│       │   │   ├── alerts.tsx    # My Alerts
│       │   │   └── profile.tsx   # Profile
│       │   ├── ride/[id].tsx
│       │   ├── search.tsx
│       │   └── admin/            # Admin screens
│       ├── components/           # Mobile-specific UI (reuses shared logic)
│       └── lib/
│           └── firebase-mobile.ts # Mobile-specific Firebase init
```

### Why Monorepo?

The `packages/shared` folder contains ALL business logic, Firebase functions, types, constants, translations, and utilities. Both `apps/web` (Next.js) and future `apps/mobile` (Expo) import from `@indasyatri/shared`. This means:

- Firestore queries are written ONCE, used everywhere
- Types are consistent across platforms
- i18n translations are shared
- Vehicle data, route constants are single source of truth
- When mobile app is built later, it only needs UI components — all logic is ready

Use npm/yarn/pnpm workspaces for the monorepo setup.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Web Framework | Next.js 14 (App Router) | Pages Router NOT used |
| Styling | Tailwind CSS | Neumorphic design system |
| Auth | Firebase Authentication | Google Sign-In only |
| Database | Cloud Firestore | Free tier (Spark plan) |
| Notifications | Firebase Cloud Messaging | Free tier, unlimited |
| Hosting | Vercel | Free tier |
| Mobile (future) | Expo React Native | EAS Build for APK |
| Language | TypeScript | Strict mode everywhere |

---

## Design System — Neumorphic Style (Indaspro-inspired)

The UI uses a **neumorphic (soft UI)** design language with smooth shadows, rounded corners, and a warm color palette. This MUST work in both light and dark modes.

### Light Mode

```css
--bg-primary: #e8e0d4;          /* Warm beige background */
--bg-secondary: #f0e8dc;        /* Slightly lighter beige */
--text-primary: #3d3428;        /* Dark brown text */
--text-secondary: #7a6e5d;      /* Muted brown text */
--accent: #d4781c;              /* Warm orange accent */
--accent-hover: #b8651a;
--accent-light: #f5dfc5;        /* Light orange for badges */
--success: #4a8c5c;             /* Green for available seats */
--danger: #c0392b;              /* Red for full/cancelled */
--whatsapp: #25D366;            /* WhatsApp green */

/* Neumorphic shadows — light mode */
--shadow-outer: 6px 6px 12px #c4bdb2, -6px -6px 12px #ffffff;
--shadow-inner: inset 4px 4px 8px #c4bdb2, inset -4px -4px 8px #ffffff;
--shadow-sm: 3px 3px 6px #c4bdb2, -3px -3px 6px #ffffff;

--border-radius: 16px;
--border-radius-sm: 12px;
--border-radius-lg: 24px;
```

### Dark Mode

```css
--bg-primary: #2a2520;          /* Dark warm brown */
--bg-secondary: #352f28;        /* Slightly lighter */
--text-primary: #e8e0d4;        /* Light beige text */
--text-secondary: #a89882;      /* Muted beige text */
--accent: #e8943a;              /* Brighter orange in dark */

/* Neumorphic shadows — dark mode */
--shadow-outer: 6px 6px 12px #1e1a16, -6px -6px 12px #363024;
--shadow-inner: inset 4px 4px 8px #1e1a16, inset -4px -4px 8px #363024;
```

### Neumorphic Component Patterns

```
NeuCard:      background: var(--bg-primary); box-shadow: var(--shadow-outer); border-radius: 16px; padding: 20px;
NeuButton:    background: var(--bg-primary); box-shadow: var(--shadow-outer); → on press: box-shadow: var(--shadow-inner);
NeuInput:     background: var(--bg-primary); box-shadow: var(--shadow-inner); border: none; padding: 12px 16px;
NeuSelect:    Same as NeuInput with dropdown arrow
NeuBadge:     Small pill with accent-light bg, accent text, no shadow
```

### Typography

```
Font Family: 'Poppins' (Latin) + 'Noto Sans Bengali' (Bengali script)
Headings: Poppins 600 (SemiBold)
Body: Poppins 400 (Regular)
Caption: Poppins 300 (Light)

Scale:
  h1: 28px / 1.3
  h2: 22px / 1.35
  h3: 18px / 1.4
  body: 15px / 1.5
  caption: 13px / 1.4
```

### Logo

Text-based logo: "IndasYatri" with a small car/road icon. Use an inline SVG or emoji 🚗. Bengali subtitle below: "ইন্দাসযাত্রী". Accent color for "Yatri" / "যাত্রী" part.

---

## Authentication

### Google Sign-In Only

- Use `signInWithPopup` on desktop, `signInWithRedirect` on mobile browsers
- On first login, auto-create user document in Firestore `users/{uid}`
- Extract `displayName`, `email`, `photoURL` from Google profile
- User MUST manually add phone and WhatsApp number in profile before posting a ride
- No anonymous access — login required for: posting rides, booking, suggesting routes, setting alerts
- Browsing rides and searching is allowed WITHOUT login

### User Roles

- `"user"` — default role on signup
- `"admin"` — manually set in Firestore console (no admin registration flow)
- Admin check: `if (user.role === 'admin')` → show admin panel link in header

---

## Firestore Data Model

### Collection: `users/{uid}`

```typescript
interface User {
  uid: string;
  name: string;                  // From Google
  email: string;                 // From Google
  photoURL: string;              // From Google
  phone: string;                 // User adds manually (required to post ride)
  whatsapp: string;              // User adds manually (can be same as phone)
  role: 'user' | 'admin';
  tripsPosted: number;           // Auto-incremented
  tripsCompleted: number;        // Future use
  isBanned: boolean;
  preferredLang: 'en' | 'bn';
  preferredTheme: 'light' | 'dark' | 'system';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Collection: `routes/{routeId}`

```typescript
interface Route {
  id: string;
  from: string;                  // Location name, e.g., "Indus"
  to: string;                   // Location name, e.g., "Kolkata"
  fromBn: string;               // Bengali name, e.g., "ইন্দাস"
  toBn: string;                 // Bengali name, e.g., "কলকাতা"
  status: 'approved' | 'pending' | 'rejected';
  submittedBy: string | null;   // uid (null if admin-created)
  submittedByName: string | null;
  distance: string;             // "120 km" (optional, admin fills)
  estimatedTime: string;        // "3 hours" (optional)
  suggestedFareMin: number;     // Admin sets, e.g., 250
  suggestedFareMax: number;     // Admin sets, e.g., 350
  isActive: boolean;            // Admin can deactivate without deleting
  rideCount: number;            // How many rides posted on this route
  createdAt: Timestamp;
}
```

**Important:** When admin approves a route "A → B", auto-create reverse route "B → A" with same details. Both share a `pairId` field to link them.

### Collection: `rides/{rideId}`

```typescript
interface Ride {
  id: string;
  routeId: string;               // Links to approved route
  routeFrom: string;             // Denormalized for query performance
  routeTo: string;               // Denormalized
  driverUid: string;
  driverName: string;            // Denormalized
  driverPhoto: string;           // Denormalized
  driverPhone: string;           // Denormalized
  driverWhatsapp: string;        // Denormalized
  date: string;                  // "2026-07-23" (YYYY-MM-DD for querying)
  departureTime: string;         // "09:00" (HH:MM 24hr)
  totalSeats: number;            // 1-7
  availableSeats: number;        // Decremented on booking
  pricePerSeat: number;          // In INR
  vehicleType: string;           // "Hatchback" | "Sedan" | "SUV" | "MUV/MPV"
  vehicleModel: string;          // "Mahindra Bolero" or custom text
  vehicleNumber: string;         // "WB 26 X 1234"
  notes: string;                 // Optional driver notes ("AC available", "pickup from bus stand")
  status: 'active' | 'full' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Collection: `bookings/{bookingId}`

```typescript
interface Booking {
  id: string;
  rideId: string;
  routeFrom: string;             // Denormalized
  routeTo: string;               // Denormalized
  date: string;                  // Denormalized
  passengerUid: string;
  passengerName: string;
  passengerPhone: string;
  seatsBooked: number;
  status: 'confirmed' | 'cancelled';
  bookedAt: Timestamp;
}
```

### Collection: `alerts/{alertId}`

```typescript
interface RideAlert {
  id: string;
  userUid: string;
  userName: string;
  routeId: string;
  routeFrom: string;             // Denormalized
  routeTo: string;               // Denormalized
  targetDate: string;            // "2026-07-23" or "any" for any date
  isActive: boolean;
  fcmToken: string;              // For push notification
  createdAt: Timestamp;
}
```

### Document: `settings/general`

```typescript
interface AppSettings {
  upcomingRideDays: number;      // Default: 7 (configurable by admin)
  maxSeatsPerRide: number;       // Default: 7
  appName: string;               // "IndasYatri"
  maintenanceMode: boolean;      // If true, show "under maintenance" page
}
```

### Firestore Composite Indexes Required

```
rides: (status ASC, date ASC)
rides: (routeFrom ASC, routeTo ASC, date ASC, status ASC)
rides: (driverUid ASC, createdAt DESC)
routes: (status ASC, createdAt DESC)
alerts: (routeId ASC, targetDate ASC, isActive ASC)
bookings: (passengerUid ASC, bookedAt DESC)
bookings: (rideId ASC, status ASC)
```

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: read own, write own (except role field)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'isBanned']);
    }

    // Routes: anyone can read approved, logged-in can suggest, admin can manage
    match /routes/{routeId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }

    // Rides: anyone can read active, logged-in driver can create/update own
    match /rides/{rideId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.driverUid == request.auth.uid;
      allow update: if request.auth.uid == resource.data.driverUid || isAdmin();
      allow delete: if isAdmin();
    }

    // Bookings: passenger can create/read own, driver can read for their rides
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
                    && request.resource.data.passengerUid == request.auth.uid;
      allow update: if request.auth.uid == resource.data.passengerUid || isAdmin();
    }

    // Alerts: user manages own alerts
    match /alerts/{alertId} {
      allow read, create: if request.auth != null
                          && request.auth.uid == request.resource.data.userUid;
      allow update, delete: if request.auth != null
                            && request.auth.uid == resource.data.userUid;
    }

    // Settings: anyone can read, admin can write
    match /settings/{doc} {
      allow read: if true;
      allow write: if isAdmin();
    }

    function isAdmin() {
      return request.auth != null
             && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## Vehicle Data (Cascading Dropdown)

```typescript
const VEHICLE_DATA = {
  "Hatchback": [
    "Maruti WagonR", "Maruti Alto", "Maruti Swift", "Maruti Celerio",
    "Tata Tiago", "Hyundai i10 Grand", "Hyundai i20",
    "Other"
  ],
  "Sedan": [
    "Maruti Swift Dzire", "Hyundai Aura", "Honda Amaze",
    "Tata Tigor", "Maruti Ciaz", "Hyundai Verna",
    "Other"
  ],
  "SUV": [
    "Mahindra Bolero", "Mahindra Scorpio", "Tata Nexon", "Hyundai Creta",
    "Tata Harrier", "Kia Seltos", "Maruti Brezza", "Mahindra XUV700",
    "Other"
  ],
  "MUV/MPV": [
    "Maruti Ertiga", "Toyota Innova", "Kia Carens",
    "Maruti XL6", "Mahindra Marazzo", "Toyota Innova Crysta",
    "Other"
  ]
};
```

When user selects "Other" → show a text input for custom car name.

---

## Internationalization (i18n)

Two languages: English (`en`) and Bengali (`bn`).

### Implementation

- Language state stored in React Context (`LangContext`)
- User preference saved in Firestore `users/{uid}.preferredLang` and `localStorage`
- `t(key)` function reads from JSON translation files
- Toggle in header switches instantly (no page reload)
- All UI strings, labels, placeholders, error messages, toasts MUST use `t(key)`
- Route names have both `from`/`to` (English) and `fromBn`/`toBn` (Bengali)

### Translation File Structure (en.json example)

```json
{
  "app": {
    "name": "IndasYatri",
    "tagline": "Share rides, save money, travel together"
  },
  "nav": {
    "home": "Home",
    "findRide": "Find a Ride",
    "offerRide": "Offer a Ride",
    "myRides": "My Rides",
    "profile": "Profile",
    "admin": "Admin Panel",
    "alerts": "Ride Alerts"
  },
  "home": {
    "hero": "Your trusted ride-sharing companion for Bengal's small towns",
    "upcomingRides": "Upcoming Rides",
    "popularRoutes": "Popular Routes",
    "howItWorks": "How It Works",
    "step1": "Search or post a ride",
    "step2": "Connect via WhatsApp or call",
    "step3": "Travel together, pay directly"
  },
  "ride": {
    "seats": "seats available",
    "perSeat": "per seat",
    "departure": "Departure",
    "whatsapp": "WhatsApp",
    "call": "Call",
    "full": "Full",
    "active": "Active",
    "cancelled": "Cancelled",
    "noRides": "No rides available for this route and date"
  },
  "form": {
    "selectRoute": "Select route",
    "selectDate": "Select date",
    "vehicleType": "Vehicle type",
    "vehicleModel": "Car model",
    "vehicleNumber": "Vehicle number (e.g., WB 26 X 1234)",
    "totalSeats": "Total seats available",
    "pricePerSeat": "Price per seat (₹)",
    "departureTime": "Departure time",
    "notes": "Notes (optional)",
    "suggestedFare": "Suggested fare for this route",
    "postRide": "Post Ride",
    "search": "Search"
  },
  "auth": {
    "signIn": "Sign in with Google",
    "signOut": "Sign Out",
    "addPhone": "Please add your phone number to post rides",
    "addWhatsApp": "Please add your WhatsApp number"
  },
  "route": {
    "suggestNew": "Suggest a New Route",
    "from": "From",
    "to": "To",
    "pending": "Your route suggestion is under review",
    "approved": "Approved",
    "rejected": "Rejected"
  },
  "alert": {
    "create": "Alert me for this route",
    "active": "Active Alerts",
    "notify": "We'll notify you when a ride is posted"
  },
  "admin": {
    "dashboard": "Dashboard",
    "routes": "Manage Routes",
    "rides": "All Rides",
    "users": "Users",
    "settings": "Settings",
    "approve": "Approve",
    "reject": "Reject",
    "pendingRoutes": "Pending Route Requests",
    "addRoute": "Add New Route",
    "upcomingDays": "Show upcoming rides for (days)",
    "totalUsers": "Total Users",
    "totalRides": "Total Rides",
    "activeRoutes": "Active Routes"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "today": "Today",
    "tomorrow": "Tomorrow"
  }
}
```

Create equivalent `bn.json` with full Bengali translations for every key.

---

## Page-by-Page Specification

### 1. Homepage (`/`)

**Header:** Logo (IndasYatri ইন্দাসযাত্রী) | Nav links | LangToggle (EN/বাং) | ThemeToggle (☀️/🌙) | LoginButton/UserAvatar

**Hero Section:**
- Heading: "Your trusted ride-sharing companion for Bengal's small towns"
- Subtext: one-liner explaining the concept
- Neumorphic card styling, subtle warm gradient

**Two Action Cards (side by side on desktop, stacked on mobile):**
- 🚗 "Find a Ride" → navigates to `/search`
- 🙋 "Offer a Ride" → navigates to `/offer` (requires login, redirect to login if not)

**Upcoming Rides Section:**
- Heading: "Upcoming Rides"
- Fetch rides where `status === 'active'` AND `date >= today` AND `date <= today + N days` (N from `settings/general.upcomingRideDays`)
- Group rides by date with `DateGroupHeader` ("Today", "Tomorrow, July 24", "Friday, July 25")
- Show `RideCard` for each ride
- If no rides: show `EmptyState` with message "No rides posted yet. Be the first!"

**Popular Routes Section:**
- Show approved routes as clickable chips/tags
- Tapping a chip navigates to `/search?from=X&to=Y`
- Only show routes with `isActive === true` and `status === 'approved'`

**How It Works Section:**
- Three steps with icons:
  1. Search or post a ride
  2. Connect via WhatsApp or call
  3. Travel together, pay directly

**Footer:** "Suggest a New Route" link | "About IndasYatri" | Contact

### 2. Find a Ride (`/search`)

- `RideSearchForm`: two dropdowns (From, To — populated from approved routes) + date picker
- Pre-fill from/to if query params exist (from Popular Routes chips)
- Results: `RideList` showing matching rides sorted by departure time
- Each `RideCard` shows:
  - Route: "Indus → Kolkata"
  - Date + departure time
  - Driver: photo + name + trip count badge ("15 rides completed")
  - Vehicle: "Mahindra Bolero (SUV)"
  - Seats: "2 of 3 seats available" with visual indicator
  - Price: "₹300/seat"
  - Vehicle number: "WB 26 X 1234"
  - Driver notes if any
  - Two CTA buttons: WhatsApp (green, prefilled message) + Call (blue)
- WhatsApp deeplink: `https://wa.me/91{phone}?text=Hi, I want to book a seat on your {date} ride from {from} to {to} at {time}. Seen on IndasYatri.`
- If no results: "No rides for this route on this date. Set a ride alert?" with link to alert creation

### 3. Offer a Ride (`/offer`) — Protected Route

- Requires login
- Requires phone + WhatsApp in profile (show warning + link to profile if missing)
- Form fields:
  1. Route dropdown (approved routes only, format: "Indus → Kolkata")
  2. Date picker (today onwards)
  3. Departure time picker
  4. Vehicle Type dropdown (Hatchback / Sedan / SUV / MUV/MPV)
  5. Vehicle Model dropdown (filtered by type, includes "Other" option)
  6. Custom vehicle name input (shown only if "Other" selected)
  7. Vehicle number text input (placeholder: "WB 26 X 1234")
  8. Total seats (number input, 1-7)
  9. Price per seat in ₹ (number input)
  10. Notes (optional textarea)
- Show suggested fare range from route data: "Suggested: ₹250 - ₹350"
- On submit:
  - Create ride document in Firestore
  - Increment `tripsPosted` on user document
  - Increment `rideCount` on route document
  - Check for matching alerts → trigger notification
  - Show success toast → redirect to My Rides

### 4. Ride Detail (`/ride/[id]`)

- Full page view of a single ride
- All info from RideCard + map embed (future, optional)
- Larger WhatsApp + Call buttons
- "Book a Seat" button → creates booking document, decrements `availableSeats`
- If ride is full, show "This ride is full" state
- Share button (copy link / WhatsApp share)

### 5. Profile (`/profile`) — Protected Route

- Google info display (photo, name, email — read-only)
- Editable fields:
  - Phone number (with +91 prefix)
  - WhatsApp number (checkbox: "Same as phone number")
  - Preferred language (EN / BN)
  - Preferred theme (Light / Dark / System)
- Save button updates Firestore user document
- Display: "Rides posted: X"

### 6. My Rides (`/my-rides`) — Protected Route

- List of rides posted by current user
- Each ride shows status badge (Active / Full / Completed / Cancelled)
- Actions: Edit (limited fields) | Mark as Full | Mark as Completed | Cancel
- Cancel confirmation dialog

### 7. My Bookings (`/my-bookings`) — Protected Route

- List of rides the current user has booked as a passenger
- Shows ride details + booking status
- Cancel booking option

### 8. Suggest Route (`/suggest-route`) — Protected Route

- Form: From (text input) + To (text input) + optional notes
- Bengali name inputs: FromBn + ToBn
- On submit: creates route document with `status: 'pending'`
- Show message: "Your route suggestion has been submitted for admin review"
- List of user's previous suggestions with status

### 9. Ride Alerts (`/alerts`) — Protected Route

- Create alert: select route + date (or "any date") → subscribe
- List of active alerts with delete option
- Request notification permission (FCM) on this page
- Max 5 active alerts per user

### 10. Admin Dashboard (`/admin`) — Admin Only

- Stats cards: Total Users, Total Rides (this week), Active Routes, Pending Route Requests
- Quick links to sub-pages

### 11. Admin: Routes (`/admin/routes`) — Admin Only

- **Pending tab:** List of pending route requests with Approve/Reject buttons
  - On approve: set `status: 'approved'`, auto-create reverse route
  - On reject: set `status: 'rejected'`
- **Approved tab:** All approved routes, toggle `isActive`, edit fare range
- **Add New Route:** form with from, to, fromBn, toBn, distance, estimatedTime, suggestedFareMin, suggestedFareMax

### 12. Admin: Rides (`/admin/rides`) — Admin Only

- List all rides with filters (route, date, status)
- Admin can cancel any ride

### 13. Admin: Users (`/admin/users`) — Admin Only

- List all users
- Ban/unban toggle
- View user's ride history

### 14. Admin: Settings (`/admin/settings`) — Admin Only

- `upcomingRideDays`: number input (how many days to show on homepage)
- `maxSeatsPerRide`: number input
- `maintenanceMode`: toggle
- Save updates `settings/general` document

---

## WhatsApp & Call Integration

### WhatsApp Deeplink Generator

```typescript
function generateWhatsAppLink(phone: string, ride: Ride): string {
  const message = encodeURIComponent(
    `Hi, I want to book a seat on your ${ride.date} ride from ${ride.routeFrom} to ${ride.routeTo} at ${ride.departureTime}. ` +
    `Vehicle: ${ride.vehicleModel}. Price: ₹${ride.pricePerSeat}/seat. ` +
    `Seen on IndasYatri.`
  );
  // Remove +91, spaces, dashes from phone
  const cleanPhone = phone.replace(/[\s\-\+]/g, '');
  const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${fullPhone}?text=${message}`;
}
```

### Phone Call Link

```typescript
function generateCallLink(phone: string): string {
  const cleanPhone = phone.replace(/[\s\-]/g, '');
  return `tel:+91${cleanPhone}`;
}
```

---

## Dark / Light Mode

- Three options: Light, Dark, System (follows OS preference)
- Stored in: `localStorage` (for immediate access) + `users/{uid}.preferredTheme` (for persistence)
- Implementation: CSS custom properties toggled via class on `<html>` element (`class="dark"` / `class="light"`)
- All neumorphic shadows MUST adapt — light mode uses light shadows, dark mode uses dark shadows
- Toggle component in header: sun/moon icon

---

## Ride Alerts (Push Notifications)

### Flow

1. User goes to `/alerts`, selects route + date → creates alert document in Firestore
2. User grants notification permission → FCM token saved to alert document
3. When a NEW ride is posted (in `offer` page submit handler):
   - Query `alerts` collection: `routeId === ride.routeId AND (targetDate === ride.date OR targetDate === 'any') AND isActive === true`
   - For each matching alert, send FCM notification
4. FCM notification payload:
   ```json
   {
     "title": "New ride on your route!",
     "body": "Indus → Kolkata on July 23 at 9 AM. ₹300/seat. 3 seats available.",
     "click_action": "https://indasyatri.vercel.app/ride/{rideId}"
   }
   ```

### Note on FCM in Free Tier

- FCM sending from client-side is NOT directly possible — needs a server/Cloud Function
- **For MVP:** Use Firestore `onSnapshot` listener on the alerts page itself. When user has the app open, they see new rides in real-time. True push notifications require Firebase Cloud Functions (Blaze plan) or a free alternative like a Vercel API route that sends FCM.
- **Recommended MVP approach:** Vercel serverless API route (`/api/notify`) that is called after ride creation, queries matching alerts, and sends FCM via Firebase Admin SDK. This works on Vercel free tier.

---

## Seed Data

On first admin login, provide a button or script to seed initial routes:

```typescript
const SEED_ROUTES = [
  { from: "Indus", to: "Kolkata", fromBn: "ইন্দাস", toBn: "কলকাতা", distance: "120 km", estimatedTime: "3 hours", suggestedFareMin: 250, suggestedFareMax: 400 },
  { from: "Bankura", to: "Kolkata", fromBn: "বাঁকুড়া", toBn: "কলকাতা", distance: "230 km", estimatedTime: "5 hours", suggestedFareMin: 400, suggestedFareMax: 600 },
  { from: "Bishnupur", to: "Kolkata", fromBn: "বিষ্ণুপুর", toBn: "কলকাতা", distance: "200 km", estimatedTime: "4.5 hours", suggestedFareMin: 350, suggestedFareMax: 550 },
  { from: "Durgapur", to: "Kolkata", fromBn: "দুর্গাপুর", toBn: "কলকাতা", distance: "180 km", estimatedTime: "3.5 hours", suggestedFareMin: 300, suggestedFareMax: 500 },
  { from: "Indus", to: "Bankura", fromBn: "ইন্দাস", toBn: "বাঁকুড়া", distance: "45 km", estimatedTime: "1.5 hours", suggestedFareMin: 100, suggestedFareMax: 200 },
  { from: "Bankura", to: "Durgapur", fromBn: "বাঁকুড়া", toBn: "দুর্গাপুর", distance: "80 km", estimatedTime: "2 hours", suggestedFareMin: 150, suggestedFareMax: 250 },
];
```

Each route auto-creates its reverse (Kolkata → Indus, etc.).

---

## Responsive Design

- **Mobile-first** approach (primary audience uses phones)
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`
- Mobile: single column, bottom navigation bar, full-width cards
- Desktop: two-column grid for ride cards, sidebar for admin, top navigation
- Touch targets: minimum 44px height for all interactive elements
- Bottom navigation on mobile: Home | Search | + (Offer) | Alerts | Profile

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=         # For FCM web push

# Server-side (for API routes / FCM sending)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

---

## Performance Guidelines

- Use Next.js dynamic imports for admin pages (not loaded for regular users)
- Firestore queries must use indexes (no full collection scans)
- Paginate ride lists: 20 rides per page
- Cache settings document — read once on app load, store in context
- Images: use `next/image` with Google profile photo URLs
- Bundle size: keep under 200KB first load JS

---

## Error Handling

- All Firestore operations wrapped in try/catch
- User-friendly toast messages for errors (not raw error codes)
- Offline indicator: "You are offline. Some features may not work."
- Form validation: client-side before Firestore write
- Auth errors: "Sign-in failed. Please try again."

---

## Deployment

- Deploy to Vercel via GitHub integration
- Branch: `main` → production (`indasyatri.vercel.app`)
- Configure environment variables in Vercel dashboard
- Firebase project: `indasyatri` (create in Firebase console)
- Firestore location: `asia-south1` (Mumbai — closest to West Bengal)

---

## Future: Android APK (Phase 2)

When building the mobile app:

1. Create `apps/mobile/` with Expo + Expo Router
2. Install `@indasyatri/shared` as workspace dependency
3. All Firebase functions, types, constants, translations come from shared package
4. Only build mobile-specific UI components (React Native equivalents of web components)
5. Use `@react-native-google-signin/google-signin` for Google Auth
6. Use `react-native-firebase` for Firestore + FCM
7. Build APK with EAS Build: `eas build --platform android --profile preview`
8. Same Firestore database, same security rules, same data

The monorepo structure ensures ZERO duplication of business logic between web and mobile.

---

## Commands Reference

```bash
# Install dependencies
npm install

# Run web app locally
cd apps/web && npm run dev

# Build for production
cd apps/web && npm run build

# Deploy (via Vercel Git integration — just push to main)
git push origin main

# Future: Build Android APK
cd apps/mobile && eas build --platform android --profile preview
```
