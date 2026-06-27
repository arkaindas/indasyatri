'use client';

import React, { useState } from 'react';
import { NeuInput } from '@/components/ui/NeuInput';
import { NeuButton } from '@/components/ui/NeuButton';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Toast';
import { suggestRoute } from '@indasyatri/shared';

export function RouteSuggestForm({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useLang();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromBn, setFromBn] = useState('');
  const [toBn, setToBn] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      await suggestRoute({
        from,
        to,
        fromBn,
        toBn,
        submittedBy: user.uid,
        submittedByName: user.name,
        distance: '',
        estimatedTime: '',
        suggestedFareMin: 0,
        suggestedFareMax: 0,
      });
      showToast(t('route.pending'), 'success');
      setFrom(''); setTo(''); setFromBn(''); setToBn('');
      onSuccess?.();
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <NeuInput
          label={t('route.from')}
          placeholder="e.g., Indus"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
        <NeuInput
          label={t('route.to')}
          placeholder="e.g., Kolkata"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <NeuInput
          label={t('route.fromBn')}
          placeholder="যেমন: ইন্দাস"
          value={fromBn}
          onChange={(e) => setFromBn(e.target.value)}
        />
        <NeuInput
          label={t('route.toBn')}
          placeholder="যেমন: কলকাতা"
          value={toBn}
          onChange={(e) => setToBn(e.target.value)}
        />
      </div>
      <NeuButton
        type="submit"
        variant="accent"
        disabled={submitting || !from || !to}
      >
        {submitting ? t('common.loading') : t('route.suggestNew')}
      </NeuButton>
    </form>
  );
}
