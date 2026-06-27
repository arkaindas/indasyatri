'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NeuInput } from '@/components/ui/NeuInput';
import { NeuButton } from '@/components/ui/NeuButton';
import { NeuSelect } from '@/components/ui/NeuSelect';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/components/common/Toast';
import { updateUser } from '@indasyatri/shared';

function ProfileForm() {
  const { t, lang, setLang } = useLang();
  const { user, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [phone, setPhone] = useState(user?.phone ?? '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp ?? '');
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setPhone(user.phone);
      setWhatsapp(user.whatsapp);
    }
  }, [user]);

  useEffect(() => {
    if (sameAsPhone) setWhatsapp(phone);
  }, [sameAsPhone, phone]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUser(user.uid, {
        phone,
        whatsapp: sameAsPhone ? phone : whatsapp,
        preferredLang: lang,
        preferredTheme: theme,
      });
      await refreshUser();
      showToast(t('profile.saved'), 'success');
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t('profile.title')}</h1>

      {/* Google info */}
      <div className="neu-card flex items-center gap-4">
        {user.photoURL && (
          <Image src={user.photoURL} alt={user.name} width={56} height={56} className="rounded-full" />
        )}
        <div>
          <div className="font-semibold">{user.name}</div>
          <div className="text-sm text-[var(--text-secondary)]">{user.email}</div>
          <div className="text-xs mt-1 text-[var(--accent)]">
            🚗 {user.tripsPosted} {t('profile.tripsPosted')}
          </div>
        </div>
      </div>

      {/* Editable fields */}
      <div className="neu-card flex flex-col gap-4">
        <NeuInput
          label={t('profile.phone')}
          type="tel"
          placeholder="9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div>
          <NeuInput
            label={t('profile.whatsapp')}
            type="tel"
            placeholder="9876543210"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            disabled={sameAsPhone}
          />
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sameAsPhone}
              onChange={(e) => setSameAsPhone(e.target.checked)}
              className="accent-[var(--accent)]"
            />
            <span className="text-sm text-[var(--text-secondary)]">{t('profile.sameAsPhone')}</span>
          </label>
        </div>

        <NeuSelect
          label={t('profile.language')}
          options={[
            { value: 'en', label: 'English' },
            { value: 'bn', label: 'বাংলা' },
          ]}
          value={lang}
          onChange={(e) => setLang(e.target.value as 'en' | 'bn')}
        />

        <NeuSelect
          label={t('profile.theme')}
          options={[
            { value: 'light', label: t('profile.themeLight') },
            { value: 'dark', label: t('profile.themeDark') },
            { value: 'system', label: t('profile.themeSystem') },
          ]}
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        />

        <NeuButton variant="accent" onClick={handleSave} disabled={saving}>
          {saving ? t('common.loading') : t('profile.save')}
        </NeuButton>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileForm />
    </ProtectedRoute>
  );
}
