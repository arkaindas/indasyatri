'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NeuInput } from '@/components/ui/NeuInput';
import { NeuSelect } from '@/components/ui/NeuSelect';
import { NeuButton } from '@/components/ui/NeuButton';
import { VehicleSelect } from './VehicleSelect';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { useApprovedRoutes } from '@/hooks/useRoutes';
import { useToast } from '@/components/common/Toast';
import { postRide } from '@indasyatri/shared';
import { todayString } from '@indasyatri/shared';
import type { Route } from '@indasyatri/shared';

export function RidePostForm() {
  const { t } = useLang();
  const { user } = useAuth();
  const { routes } = useApprovedRoutes();
  const { showToast } = useToast();
  const router = useRouter();

  const [routeId, setRouteId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [seats, setSeats] = useState(3);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedRoute: Route | undefined = routes.find((r) => r.id === routeId);

  const routeOptions = routes.map((r) => ({
    value: r.id,
    label: `${r.from} → ${r.to}`,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRoute) return;

    const finalModel = vehicleModel === 'Other' ? customModel : vehicleModel;

    setSubmitting(true);
    try {
      await postRide({
        routeId,
        routeFrom: selectedRoute.from,
        routeTo: selectedRoute.to,
        driverUid: user.uid,
        driverName: user.name,
        driverPhoto: user.photoURL,
        driverPhone: user.phone,
        driverWhatsapp: user.whatsapp,
        date,
        departureTime: time,
        totalSeats: seats,
        availableSeats: seats,
        pricePerSeat: Number(price),
        vehicleType,
        vehicleModel: finalModel,
        vehicleNumber: vehicleNumber.toUpperCase(),
        notes,
        status: 'active',
      });
      showToast('Ride posted successfully!', 'success');
      router.push('/my-rides');
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  if (!user.phone || !user.whatsapp) {
    return (
      <div className="neu-card text-center">
        <p className="text-[var(--text-secondary)] mb-4">{t('auth.addPhone')}</p>
        <NeuButton variant="accent" onClick={() => router.push('/profile')}>
          Go to Profile
        </NeuButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <NeuSelect
        label={t('form.selectRoute')}
        options={routeOptions}
        placeholder={t('form.selectRoute')}
        value={routeId}
        onChange={(e) => setRouteId(e.target.value)}
      />

      {selectedRoute && (
        <div className="neu-card-sm text-sm text-[var(--text-secondary)]">
          💰 {t('form.suggestedFare')}: ₹{selectedRoute.suggestedFareMin} – ₹{selectedRoute.suggestedFareMax}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">
            {t('form.selectDate')}
          </label>
          <input
            type="date"
            className="neu-input"
            value={date}
            min={todayString()}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">
            {t('form.departureTime')}
          </label>
          <input
            type="time"
            className="neu-input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <VehicleSelect
        vehicleType={vehicleType}
        vehicleModel={vehicleModel}
        customModel={customModel}
        onTypeChange={setVehicleType}
        onModelChange={setVehicleModel}
        onCustomModelChange={setCustomModel}
      />

      <NeuInput
        label={t('form.vehicleNumber')}
        placeholder={t('form.vehicleNumber')}
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        required
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">
            {t('form.totalSeats')}
          </label>
          <input
            type="number"
            className="neu-input"
            min={1}
            max={7}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            required
          />
        </div>
        <NeuInput
          label={t('form.pricePerSeat')}
          type="number"
          placeholder="300"
          min={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">
          {t('form.notes')}
        </label>
        <textarea
          className="neu-input resize-none"
          rows={3}
          placeholder={t('form.notesPlaceholder')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <NeuButton
        type="submit"
        variant="accent"
        size="lg"
        disabled={submitting || !routeId || !date || !time || !vehicleType || !vehicleModel || !vehicleNumber || !price}
        className="w-full"
      >
        {submitting ? t('common.loading') : `🚗 ${t('form.postRide')}`}
      </NeuButton>
    </form>
  );
}
