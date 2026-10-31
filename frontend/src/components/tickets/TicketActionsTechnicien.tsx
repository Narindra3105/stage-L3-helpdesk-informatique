import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../common/Modal';
import TransfertForm from './TransfertForm';
import { trouverStatutParNom } from '../../utils/statuts';
import type { Statut } from '../../types/referentiel';
import type { Ticket } from '../../types/ticket';

const classePrimaire =
  'w-full rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60';

const classeSecondaire =
  'w-full rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60';

interface TicketActionsTechnicienProps {
  ticket: Ticket;
  statuts: Statut[];
  enCours: boolean;
  onStatut: (statutId: number) => void;
  onPrendre: () => void;
  onTransfert: () => void;
}

export default function TicketActionsTechnicien({
  ticket,
  statuts,
  enCours,
  onStatut,
  onPrendre,
  onTransfert,
}: TicketActionsTechnicienProps) {
  const { user } = useAuth();
  const [transfertOuvert, setTransfertOuvert] = useState<boolean>(false);

  if (user === null) {
    return null;
  }

  const statutEnCours = trouverStatutParNom(statuts, 'en cours');
  const statutAttente = trouverStatutParNom(statuts, 'en attente');
  const statutResolu = trouverStatutParNom(statuts, 'résolu');
  const estMoi = ticket.technicien_id === user.id;

  const renduActions = () => {
    if (ticket.est_final) {
      return <p className="text-sm text-slate-500">Ce ticket est terminé.</p>;
    }

    if (ticket.technicien_id === null) {
      return (
        <button onClick={onPrendre} disabled={enCours} className={classePrimaire}>
          Prendre ce ticket
        </button>
      );
    }

    if (!estMoi) {
      return (
        <p className="text-sm text-slate-500">Ce ticket est assigné à {ticket.technicien_nom}.</p>
      );
    }

    return (
      <>
        {statutResolu && (
          <button
            onClick={() => onStatut(statutResolu.id)}
            disabled={enCours}
            className={classePrimaire}
          >
            Marquer comme résolu
          </button>
        )}

        {statutEnCours && ticket.statut_id !== statutEnCours.id && (
          <button
            onClick={() => onStatut(statutEnCours.id)}
            disabled={enCours}
            className={classeSecondaire}
          >
            {statutAttente && ticket.statut_id === statutAttente.id
              ? 'Reprendre le traitement'
              : 'Démarrer le traitement'}
          </button>
        )}

        {statutAttente && ticket.statut_id !== statutAttente.id && (
          <button
            onClick={() => onStatut(statutAttente.id)}
            disabled={enCours}
            className={classeSecondaire}
          >
            Mettre en attente
          </button>
        )}

        <button
          onClick={() => setTransfertOuvert(true)}
          disabled={enCours}
          className={classeSecondaire}
        >
          Transférer à un collègue
        </button>
      </>
    );
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Actions</h2>

      {renduActions()}

      {transfertOuvert && (
        <Modal titre="Transférer à un collègue" onFermer={() => setTransfertOuvert(false)}>
          <TransfertForm
            ticket={ticket}
            monId={user.id}
            onSucces={() => {
              setTransfertOuvert(false);
              onTransfert();
            }}
            onAnnuler={() => setTransfertOuvert(false)}
          />
        </Modal>
      )}
    </div>
  );
}