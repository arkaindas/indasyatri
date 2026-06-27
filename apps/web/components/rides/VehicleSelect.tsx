'use client';

import React from 'react';
import { VEHICLE_DATA, VEHICLE_TYPES } from '@indasyatri/shared';
import { NeuSelect } from '@/components/ui/NeuSelect';
import { NeuInput } from '@/components/ui/NeuInput';
import { useLang } from '@/context/LangContext';

interface VehicleSelectProps {
  vehicleType: string;
  vehicleModel: string;
  customModel: string;
  onTypeChange: (v: string) => void;
  onModelChange: (v: string) => void;
  onCustomModelChange: (v: string) => void;
}

export function VehicleSelect({
  vehicleType,
  vehicleModel,
  customModel,
  onTypeChange,
  onModelChange,
  onCustomModelChange,
}: VehicleSelectProps) {
  const { t } = useLang();

  const typeOptions = VEHICLE_TYPES.map((v) => ({ value: v, label: v }));
  const modelOptions = vehicleType
    ? VEHICLE_DATA[vehicleType].map((v) => ({ value: v, label: v }))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <NeuSelect
        label={t('form.vehicleType')}
        options={typeOptions}
        placeholder={t('form.selectRoute')}
        value={vehicleType}
        onChange={(e) => { onTypeChange(e.target.value); onModelChange(''); }}
      />
      <NeuSelect
        label={t('form.vehicleModel')}
        options={modelOptions}
        placeholder={vehicleType ? t('form.selectRoute') : t('form.selectVehicleTypeFirst')}
        value={vehicleModel}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={!vehicleType}
      />
      {vehicleModel === 'Other' && (
        <NeuInput
          label={t('form.vehicleModelCustom')}
          placeholder={t('form.vehicleModelCustom')}
          value={customModel}
          onChange={(e) => onCustomModelChange(e.target.value)}
        />
      )}
    </div>
  );
}
