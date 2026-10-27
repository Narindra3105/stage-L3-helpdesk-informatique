import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api/statsService';
import StatCard from '../components/common/StatCard';
import WorkloadList from '../components/dashboard/WorkloadList';
import LatestTicketsTable from '../components/dashboard/LatestTicketsTable';
import { formatDuree } from '../utils/format';
import type { DashboardStats } from '../types/stats';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        setErreur('Impossible de charger les statistiques.');
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, []);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-slate-500">Vue d'ensemble de l'activité du support</p>
        </div>
        <Link
          to="/nouveau-ticket"
          className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Nouveau ticket
        </Link>
      </div>

      {loading && <p className="mt-8 text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {stats && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard label="Tickets ouverts" value={stats.resume.tickets_ouverts} />
            <StatCard
              label="SLA dépassé"
              value={stats.resume.sla_depasse}
              danger={stats.resume.sla_depasse > 0}
            />
            <StatCard label="Résolus aujourd'hui" value={stats.resume.resolus_aujourdhui} />
            <StatCard
              label="Temps moyen de résolution"
              value={formatDuree(stats.resume.temps_moyen_minutes)}
            />
            <StatCard
              label="Respect du SLA"
              value={stats.resume.respect_sla === null ? '—' : `${stats.resume.respect_sla} %`}
              hint={`${stats.resume.sla_depasse} en retard sur ${stats.resume.tickets_ouverts} ouverts`}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <WorkloadList techniciens={stats.charge_techniciens} />
            <div className="lg:col-span-2">
              <LatestTicketsTable tickets={stats.derniers_tickets} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}