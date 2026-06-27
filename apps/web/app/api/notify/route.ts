import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { getMatchingAlerts } from '@indasyatri/shared';

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  }, 'admin');
}

export async function POST(req: NextRequest) {
  try {
    const { rideId, routeId, date, routeFrom, routeTo, departureTime, pricePerSeat } = await req.json();

    const alerts = await getMatchingAlerts(routeId, date);
    if (alerts.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    const app = getAdminApp();
    const messaging = getMessaging(app);

    const tokens = alerts.map((a) => a.fcmToken).filter(Boolean);
    if (tokens.length === 0) return NextResponse.json({ sent: 0 });

    await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: 'New ride on your route!',
        body: `${routeFrom} → ${routeTo} on ${date} at ${departureTime}. ₹${pricePerSeat}/seat.`,
      },
      webpush: {
        fcmOptions: {
          link: `${process.env.NEXT_PUBLIC_APP_URL}/ride/${rideId}`,
        },
      },
    });

    return NextResponse.json({ sent: tokens.length });
  } catch (err) {
    console.error('FCM notify error:', err);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
