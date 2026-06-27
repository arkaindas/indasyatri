import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RidePostForm } from '@/components/rides/RidePostForm';

export default function OfferPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">🚗 Offer a Ride</h1>
        <RidePostForm />
      </div>
    </ProtectedRoute>
  );
}
