import { useEffect, useState } from 'react';
import { getRapportSla } from '../api/statsService';
import StatCard from '../components/common/StatCard';
import SlaChart from '../components/rapports/SlaChart';
import SlaPriorityTable from '../components/rapports/SlaPriorityTable';
import { messageErreur } from '../utils/erreurs';
import { formatDuree } from '../utils/format';
import type { RapportSla } from '../types/stats';

export default function RapportsSlaPage() {
  const [rapport, setRapport] = useState<RapportSla | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const donnees = await getRapportSla();
        setRapport(donnees);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger le rapport.'));
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
          <h1 className="text-2xl font-bold text-slate-900">Rapports SLA</h1>
          <p className="mt-1 text-sm text-slate-500">
            Performance du support sur les 6 dernières semaines
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 print:hidden"
        >
          Exporter en PDF
        </button>
      </div>

      {loading && <p className="mt-8 text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {rapport && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Respect global du SLA"
              value={rapport.resume.respect_sla === null ? '—' : `${rapport.resume.respect_sla} %`}
            />
            <StatCard
              label="Tickets créés"
              value={rapport.resume.total_tickets}
              hint="sur les 6 dernières semaines"
            />
            <StatCard
              label="Retards"
              value={rapport.resume.retards}
              danger={rapport.resume.retards > 0}
            />
            <StatCard
              label="Temps moyen de résolution"
              value={formatDuree(rapport.resume.temps_moyen_minutes)}
            />
          </div>

          <div className="mt-6 space-y-6">
            <SlaChart semaines={rapport.par_semaine} />
            <SlaPriorityTable priorites={rapport.par_priorite} />
          </div>
        </>
      )}
    </div>
  );
}