import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { assignerTicket, changerStatut, getTicket } from '../api/ticketService';
import { getStatuts } from '../api/referentielService';
import { getUtilisateurs } from '../api/utilisateurService';
import { useAuth } from '../hooks/useAuth';
import Badge from '../components/common/Badge';
import PriorityBadge from '../components/tickets/PriorityBadge';
import SlaCard from '../components/tickets/SlaCard';
import TicketInfo from '../components/tickets/TicketInfo';
import { couleurStatut } from '../utils/badges';
import { messageErreur } from '../utils/erreurs';
import { peutChangerStatut } from '../utils/permissions';
import type { Statut } from '../types/referentiel';
import type { Ticket } from '../types/ticket';
import type { Utilisateur } from '../types/user';

const classeSelect =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:opacity-60';

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ticketId = Number(id);
  const idValide = Number.isInteger(ticketId) && ticketId >= 1;

  const { user } = useAuth();
  const estAdmin = user?.role === 'admin';

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [statuts, setStatuts] = useState<Statut[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurAction, setErreurAction] = useState<string | null>(null);
  const [enCours, setEnCours] = useState<boolean>(false);

  useEffect(() => {
    if (!idValide) {
      return;
    }

    const charger = async () => {
      try {
        const [donneesTicket, listeStatuts, listeUtilisateurs] = await Promise.all([
          getTicket(ticketId),
          getStatuts(),
          estAdmin ? getUtilisateurs() : Promise.resolve<Utilisateur[]>([]),
        ]);
        setTicket(donneesTicket);
        setStatuts(listeStatuts);
        setUtilisateurs(listeUtilisateurs);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger le ticket.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, [ticketId, idValide, estAdmin]);

  const appliquer = async (action: () => Promise<Ticket>) => {
    setErreurAction(null);
    setEnCours(true);
    try {
      const misAJour = await action();
      setTicket(misAJour);
    } catch (e) {
      setErreurAction(messageErreur(e, "L'action a échoué."));
    } finally {
      setEnCours(false);
    }
  };

  const surChangementStatut = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!ticket) {
      return;
    }
    const statutId = Number(event.target.value);
    if (statutId === ticket.statut_id) {
      return;
    }
    appliquer(() => changerStatut(ticket.id, statutId));
  };

  const surChangementTechnicien = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!ticket) {
      return;
    }
    const technicienId = event.target.value === '' ? null : Number(event.target.value);
    if (technicienId === ticket.technicien_id) {
      return;
    }
    appliquer(() => assignerTicket(ticket.id, technicienId));
  };

  if (!idValide) {
    return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">Ticket invalide.</p>;
  }

  const lienRetour = (
    <Link to="/tickets" className="text-sm font-medium text-blue-700 hover:underline">
      ← Retour à la liste des tickets
    </Link>
  );

  if (loading) {
    return <p className="text-slate-500">Chargement...</p>;
  }

  if (erreur || !ticket) {
    return (
      <div>
        {lienRetour}
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {erreur ?? 'Ticket introuvable.'}
        </p>
      </div>
    );
  }

  const peutModifierStatut = peutChangerStatut(user, ticket);
  const statutResolu = statuts.find((s) => s.nom.toLowerCase() === 'résolu');
  const techniciensActifs = utilisateurs.filter(
    (u) => u.role === 'technicien' && u.statut === 'actif'
  );
  const technicienCourantAbsent =
    ticket.technicien_id !== null &&
    !techniciensActifs.some((t) => t.id === ticket.technicien_id);

  return (
    <div>
      {lienRetour}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          {ticket.numero} · {ticket.sujet}
        </h1>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PriorityBadge nom={ticket.priorite_nom} couleur={ticket.priorite_couleur} />
        <Badge couleur={couleurStatut(ticket.statut_nom)}>{ticket.statut_nom}</Badge>
      </div>

      {erreurAction && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreurAction}</p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-900">Description</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
              {ticket.description ?? 'Aucune description.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <TicketInfo ticket={ticket} />
          <SlaCard ticket={ticket} />

          {(peutModifierStatut || estAdmin) && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">Actions</h2>

              {peutModifierStatut && (
                <div>
                  <label htmlFor="statut" className="block text-sm font-medium text-slate-700">
                    Statut
                  </label>
                  <select
                    id="statut"
                    value={ticket.statut_id}
                    onChange={surChangementStatut}
                    disabled={enCours}
                    className={classeSelect}
                  >
                    {statuts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nom}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {estAdmin && (
                <div>
                  <label htmlFor="technicien" className="block text-sm font-medium text-slate-700">
                    Technicien
                  </label>
                  <select
                    id="technicien"
                    value={ticket.technicien_id ?? ''}
                    onChange={surChangementTechnicien}
                    disabled={enCours || Boolean(ticket.est_final)}
                    className={classeSelect}
                  >
                    <option value="">Non assigné</option>
                    {technicienCourantAbsent && ticket.technicien_id !== null && (
                      <option value={ticket.technicien_id}>
                        {ticket.technicien_nom} (indisponible)
                      </option>
                    )}
                    {techniciensActifs.map((t) => (
                      <option key={t.id} value={t.id}>
                        {[t.prenom, t.nom].filter(Boolean).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {peutModifierStatut && statutResolu && !ticket.est_final && (
                <button
                  onClick={() => appliquer(() => changerStatut(ticket.id, statutResolu.id))}
                  disabled={enCours}
                  className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                >
                  Marquer comme résolu
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}