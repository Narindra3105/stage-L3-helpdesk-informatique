import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { getTechniciensActifs } from '../../api/technicienService';
import { transfererTicket } from '../../api/ticketService';
import { messageErreur } from '../../utils/erreurs';
import { nomComplet } from '../../utils/format';
import { classeChamp, classeLabel } from '../../utils/styles';
import type { TechnicienActif } from '../../types/technicien';
import type { Ticket } from '../../types/ticket';

interface TransfertFormProps {
  ticket: Ticket;
  monId: number;
  onSucces: () => void;
  onAnnuler: () => void;
}

export default function TransfertForm({ ticket, monId, onSucces, onAnnuler }: TransfertFormProps) {
  const [collegues, setCollegues] = useState<TechnicienActif[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreurChargement, setErreurChargement] = useState<string | null>(null);
  const [choix, setChoix] = useState<string>('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState<boolean>(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const liste = await getTechniciensActifs();
        setCollegues(liste.filter((t) => t.id !== monId));
      } catch (e) {
        setErreurChargement(messageErreur(e, 'Impossible de charger la liste des collègues.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, [monId]);

  const soumettre = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (choix === '') {
      setErreur('Choisissez un collègue.');
      return;
    }

    setErreur(null);
    setEnvoi(true);
    try {
      await transfererTicket(ticket.id, Number(choix));
      onSucces();
    } catch (e) {
      setErreur(messageErreur(e, 'Impossible de transférer le ticket.'));
      setEnvoi(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Chargement...</p>;
  }

  if (erreurChargement) {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreurChargement}</p>;
  }

  return (
    <form onSubmit={soumettre} className="space-y-4">
      <p className="text-sm text-slate-600">
        Le ticket <span className="font-semibold">{ticket.numero}</span> sera assigné à votre
        collègue et disparaîtra de votre liste.
      </p>

      {collegues.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun collègue disponible pour le moment.</p>
      ) : (
        <div>
          <label htmlFor="collegue" className={classeLabel}>
            Collègue
          </label>
          <select
            id="collegue"
            value={choix}
            onChange={(e) => setChoix(e.target.value)}
            className={classeChamp}
          >
            <option value="">Choisir…</option>
            {collegues.map((t) => (
              <option key={t.id} value={t.id}>
                {nomComplet(t.prenom, t.nom)}
              </option>
            ))}
          </select>
        </div>
      )}

      {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={envoi || collegues.length === 0}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {envoi ? 'Transfert...' : 'Transférer'}
        </button>
        <button
          type="button"
          onClick={onAnnuler}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}