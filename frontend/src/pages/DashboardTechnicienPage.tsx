import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTickets } from '../api/ticketService';
import { getPriorites } from '../api/referentielService';
import StatCard from '../components/common/StatCard';
import WatchTable from '../components/dashboard/WatchTable';
import { useAuth } from '../hooks/useAuth';
import { messageErreur } from '../utils/erreurs';
import { formatDuree, nomComplet } from '../utils/format';
import { calculerStatsTechnicien } from '../utils/statsTechnicien';
import type { Priorite } from '../types/referentiel';
import type { Ticket } from '../types/ticket';

export default function DashboardTechnicienPage() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [priorites, setPriorites] = useState<Priorite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const [listeTickets, listePriorites] = await Promise.all([getTickets(), getPriorites()]);
        setTickets(listeTickets);
        setPriorites(listePriorites);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger votre tableau de bord.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, []);

  const stats = useMemo(() => {
    if (user === null) {
      return null;
    }
    const niveaux = new Map(priorites.map((p) => [p.id, p.niveau_ordre]));
    return calculerStatsTechnicien(tickets, user.id, niveaux);
  }, [tickets, priorites, user]);

  const nombreRetards = stats ? stats.enRetard.length : 0;
  const texteRetards =
    nombreRetards === 1
      ? '1 ticket a dépassé son délai SLA'
      : `${nombreRetards} tickets ont dépassé leur délai SLA`;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Bonjour, {user ? nomComplet(user.prenom, user.nom) : ''}
      </h1>
      <p className="mt-1 text-sm text-slate-500">Voici votre journée</p>

      {loading && <p className="mt-8 text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {!loading && !erreur && stats && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Mes tickets ouverts" value={stats.ouverts} />
            <StatCard
              label="À traiter en priorité"
              value={stats.prioritaires}
              hint="priorités de niveau 1 et 2"
            />
            <StatCard label="Résolus aujourd'hui" value={stats.resolusAujourdhui} />
            <StatCard
              label="Temps moyen"
              value={formatDuree(stats.tempsMoyenMinutes)}
              hint="sur les 30 derniers jours"
            />
          </div>

          {nombreRetards > 0 && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">Attention : {texteRetards}</p>
              <ul className="mt-2 space-y-1.5">
                {stats.enRetard.slice(0, 3).map((ticket) => (
                  <li key={ticket.id} className="flex items-center justify-between gap-4 text-sm">
                    <span className="min-w-0 truncate text-red-800">
                      {ticket.numero} · {ticket.sujet}
                    </span>
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="shrink-0 font-medium text-red-700 underline"
                    >
                      Ouvrir le ticket
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold text-slate-900">Mes tickets à surveiller</h2>
              <Link to="/mes-tickets" className="text-sm font-medium text-blue-700 hover:underline">
                Voir tous mes tickets
              </Link>
            </div>

            {stats.aSurveiller.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                Aucun ticket ne vous est assigné pour le moment.{' '}
                <Link to="/file-attente" className="font-medium text-blue-700 hover:underline">
                  Consulter la file d'attente
                </Link>
              </p>
            ) : (
              <div className="mt-4">
                <WatchTable tickets={stats.aSurveiller} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}