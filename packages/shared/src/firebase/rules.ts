// Reference copy of Firestore security rules — not executed here.
// Deploy via Firebase console or `firebase deploy --only firestore:rules`

export const FIRESTORE_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'isBanned']);
    }

    match /routes/{routeId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }

    match /rides/{rideId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.driverUid == request.auth.uid;
      allow update: if request.auth.uid == resource.data.driverUid || isAdmin();
      allow delete: if isAdmin();
    }

    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
                    && request.resource.data.passengerUid == request.auth.uid;
      allow update: if request.auth.uid == resource.data.passengerUid || isAdmin();
    }

    match /alerts/{alertId} {
      allow read, create: if request.auth != null
                          && request.auth.uid == request.resource.data.userUid;
      allow update, delete: if request.auth != null
                            && request.auth.uid == resource.data.userUid;
    }

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
`;
