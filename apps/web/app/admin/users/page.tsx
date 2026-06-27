'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLang } from '@/context/LangContext';
import { useToast } from '@/components/common/Toast';
import { getAllUsers, banUser, type User } from '@indasyatri/shared';
import { NeuBadge } from '@/components/ui/NeuBadge';
import { NeuButton } from '@/components/ui/NeuButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function AdminUsersPage() {
  const { t } = useLang();
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  const handleBan = async (user: User) => {
    try {
      await banUser(user.uid, !user.isBanned);
      setUsers((prev) => prev.map((u) => u.uid === user.uid ? { ...u, isBanned: !u.isBanned } : u));
      showToast(user.isBanned ? 'User unbanned.' : 'User banned.', 'info');
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t('admin.users')}</h1>
      {users.map((user) => (
        <div key={user.uid} className="neu-card flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {user.photoURL && (
              <Image src={user.photoURL} alt={user.name} width={40} height={40} className="rounded-full" />
            )}
            <div>
              <div className="font-semibold text-sm">{user.name}</div>
              <div className="text-xs text-[var(--text-secondary)]">{user.email}</div>
              <div className="text-xs text-[var(--text-secondary)]">
                🚗 {user.tripsPosted} rides · Role: {user.role}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user.isBanned && <NeuBadge variant="danger">Banned</NeuBadge>}
            <NeuButton
              size="sm"
              variant={user.isBanned ? 'accent' : 'danger'}
              onClick={() => handleBan(user)}
            >
              {user.isBanned ? t('admin.unban') : t('admin.ban')}
            </NeuButton>
          </div>
        </div>
      ))}
      {users.length === 0 && <p className="text-center text-[var(--text-secondary)] py-6">No users.</p>}
    </div>
  );
}
