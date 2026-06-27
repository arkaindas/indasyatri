'use client';

import React, { useEffect, useState } from 'react';
import { useLang } from '@/context/LangContext';
import { useToast } from '@/components/common/Toast';
import {
  getAllRoutes, addRoute, updateRoute, approveRoute, rejectRoute,
  seedRoutes, type Route
} from '@indasyatri/shared';
import { SEED_ROUTES } from '@indasyatri/shared';
import { NeuButton } from '@/components/ui/NeuButton';
import { NeuBadge } from '@/components/ui/NeuBadge';
import { NeuInput } from '@/components/ui/NeuInput';
import { NeuToggle } from '@/components/ui/NeuToggle';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

type Tab = 'pending' | 'approved';

export default function AdminRoutesPage() {
  const { t } = useLang();
  const { showToast } = useToast();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('pending');
  const [showAdd, setShowAdd] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Add form state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromBn, setFromBn] = useState('');
  const [toBn, setToBn] = useState('');
  const [dist, setDist] = useState('');
  const [time, setTime] = useState('');
  const [fareMin, setFareMin] = useState('');
  const [fareMax, setFareMax] = useState('');

  const load = () => {
    getAllRoutes().then(setRoutes).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = routes.filter((r) => r.status === tab);

  const handleApprove = async (route: Route) => {
    await approveRoute(route.id, route);
    showToast('Approved!', 'success');
    load();
  };

  const handleReject = async (routeId: string) => {
    await rejectRoute(routeId);
    showToast('Rejected.', 'info');
    load();
  };

  const handleToggleActive = async (route: Route) => {
    await updateRoute(route.id, { isActive: !route.isActive });
    setRoutes((prev) => prev.map((r) => r.id === route.id ? { ...r, isActive: !r.isActive } : r));
  };

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRoute({
      from, to, fromBn, toBn,
      distance: dist, estimatedTime: time,
      suggestedFareMin: Number(fareMin),
      suggestedFareMax: Number(fareMax),
      status: 'approved', isActive: true,
      submittedBy: null, submittedByName: null,
    });
    showToast('Route added!', 'success');
    setShowAdd(false);
    setFrom(''); setTo(''); setFromBn(''); setToBn(''); setDist(''); setTime(''); setFareMin(''); setFareMax('');
    load();
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedRoutes(SEED_ROUTES);
      showToast('Seed routes added!', 'success');
      load();
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">{t('admin.routes')}</h1>
        <div className="flex gap-2 flex-wrap">
          <NeuButton size="sm" variant="accent" onClick={() => setShowAdd(!showAdd)}>
            + {t('admin.addRoute')}
          </NeuButton>
          <NeuButton size="sm" onClick={handleSeed} disabled={seeding}>
            {seeding ? t('common.loading') : t('admin.seedRoutes')}
          </NeuButton>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAddRoute} className="neu-card grid sm:grid-cols-2 gap-4">
          <NeuInput label={t('route.from')} value={from} onChange={(e) => setFrom(e.target.value)} required placeholder="Indas" />
          <NeuInput label={t('route.to')} value={to} onChange={(e) => setTo(e.target.value)} required placeholder="Kolkata" />
          <NeuInput label={t('route.fromBn')} value={fromBn} onChange={(e) => setFromBn(e.target.value)} placeholder="ইন্দাস" />
          <NeuInput label={t('route.toBn')} value={toBn} onChange={(e) => setToBn(e.target.value)} placeholder="কলকাতা" />
          <NeuInput label={t('route.distance')} value={dist} onChange={(e) => setDist(e.target.value)} placeholder="120 km" />
          <NeuInput label={t('route.estimatedTime')} value={time} onChange={(e) => setTime(e.target.value)} placeholder="3 hours" />
          <NeuInput label="Fare Min (₹)" type="number" value={fareMin} onChange={(e) => setFareMin(e.target.value)} placeholder="250" />
          <NeuInput label="Fare Max (₹)" type="number" value={fareMax} onChange={(e) => setFareMax(e.target.value)} placeholder="400" />
          <div className="sm:col-span-2">
            <NeuButton type="submit" variant="accent">{t('admin.addRoute')}</NeuButton>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {(['pending', 'approved'] as Tab[]).map((t_) => (
          <button
            key={t_}
            onClick={() => setTab(t_)}
            className={`neu-btn !py-2 !px-4 text-sm ${tab === t_ ? '!bg-[var(--accent)] !text-white' : ''}`}
          >
            {t_ === 'pending' ? t('admin.pendingRoutes') : t('admin.routes')} ({routes.filter((r) => r.status === t_).length})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((route) => (
          <div key={route.id} className="neu-card flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-semibold">{route.from} → {route.to}</div>
              <div className="text-sm text-[var(--text-secondary)]">
                {route.fromBn} → {route.toBn} · ₹{route.suggestedFareMin}–{route.suggestedFareMax}
                {route.submittedByName && ` · by ${route.submittedByName}`}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {tab === 'pending' ? (
                <>
                  <NeuButton size="sm" variant="accent" onClick={() => handleApprove(route)}>{t('admin.approve')}</NeuButton>
                  <NeuButton size="sm" variant="danger" onClick={() => handleReject(route.id)}>{t('admin.reject')}</NeuButton>
                </>
              ) : (
                <NeuToggle
                  checked={route.isActive}
                  onChange={() => handleToggleActive(route)}
                  label={route.isActive ? 'Active' : 'Inactive'}
                />
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-[var(--text-secondary)] py-6">No {tab} routes.</p>
        )}
      </div>
    </div>
  );
}
