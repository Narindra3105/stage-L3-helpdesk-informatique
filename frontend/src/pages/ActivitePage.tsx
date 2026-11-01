import { useEffect, useMemo, useState } from 'react';
import { getTickets } from '../api/ticketService';
import StatCard from '../components/common/StatCard';
import ActivityChart from '../components/activite/ActivityChart';
import CategoryBreakdown from '../components/activite/CategoryBreakdown';
import { useAuth } from '../hooks/useAuth';
import { calculerActiviteTechnicien } from '../utils/activiteTechnicien';
import { messageErreur } from '../utils/erreurs';
import { formatDuree } from '../utils/format';
import type { Ticket } from '../types/ticket';

export default function ActivitePage() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const liste = await getTickets();
        setTickets(liste);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger votre activité.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, []);

  const activite = useMemo(() => {
    if (user === null) {
      return null;
    }
    return calculerActiviteTechnicien(tickets, user.id);
  }, [tickets, user]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Mon activité</h1>
      <p className="mt-1 text-sm text-slate-500">Vos résultats sur la semaine</p>

      {loading && <p className="mt-8 text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {!loading && !erreur && activite && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
            <StatCard label="Résolus cette semaine" value={activite.resolus} hint={activite.periode} />
            <StatCard
              label="Respect du SLA"
              value={activite.respectSla === null ? '—' : `${activite.respectSla} %`}
              hint="tickets résolus avec un délai SLA"
            />
            <StatCard
              label="Temps moyen"
              value={formatDuree(activite.tempsMoyenMinutes)}
              hint="de la création à la résolution"
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ActivityChart jours={activite.parJour} />
            </div>
            <CategoryBreakdown categories={activite.parCategorie} />
          </div>
        </>
      )}
    </div>
  );
}