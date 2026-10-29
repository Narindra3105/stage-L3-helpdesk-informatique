import { useEffect, useState } from 'react';
import {
  creerCommentaire,
  getCommentaires,
  modifierCommentaire,
  supprimerCommentaire,
} from '../../api/commentaireService';
import { useAuth } from '../../hooks/useAuth';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { formatDateHeure } from '../../utils/date';
import { messageErreur } from '../../utils/erreurs';
import { nomComplet } from '../../utils/format';
import type { Commentaire, TypeCommentaire } from '../../types/commentaire';
import type { Ticket } from '../../types/ticket';

interface TicketCommentsProps {
  ticket: Ticket;
}

export default function TicketComments({ ticket }: TicketCommentsProps) {
  const { user } = useAuth();

  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurAction, setErreurAction] = useState<string | null>(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const liste = await getCommentaires(ticket.id);
        setCommentaires(liste);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger les commentaires.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, [ticket.id]);

  const envoyer = async (contenu: string, type: TypeCommentaire): Promise<boolean> => {
    setErreurAction(null);
    try {
      const cree = await creerCommentaire({ ticket_id: ticket.id, contenu, type });
      setCommentaires((prev) => [...prev, cree]);
      return true;
    } catch (e) {
      setErreurAction(messageErreur(e, "Impossible d'envoyer le commentaire."));
      return false;
    }
  };

  const modifier = async (id: number, contenu: string): Promise<boolean> => {
    setErreurAction(null);
    try {
      const misAJour = await modifierCommentaire(id, contenu);
      setCommentaires((prev) => prev.map((c) => (c.id === id ? misAJour : c)));
      return true;
    } catch (e) {
      setErreurAction(messageErreur(e, 'Impossible de modifier le commentaire.'));
      return false;
    }
  };

  const supprimer = async (id: number): Promise<void> => {
    setErreurAction(null);
    try {
      await supprimerCommentaire(id);
      setCommentaires((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setErreurAction(messageErreur(e, 'Impossible de supprimer le commentaire.'));
    }
  };

  const peutEcrireNote = user !== null && user.role !== 'demandeur';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Historique</h2>

      {loading && <p className="mt-4 text-sm text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {!loading && !erreur && (
        <>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center gap-3 text-sm text-slate-500">
              <span className="h-2 w-2 shrink-0 rounded-full bg-blue-700" />
              <span>
                Ticket créé par {nomComplet(ticket.demandeur_prenom, ticket.demandeur_nom)}
              </span>
              <span className="ml-auto text-xs text-slate-400">
                {formatDateHeure(ticket.date_creation)}
              </span>
            </li>

            {commentaires.map((commentaire) => {
              const estAuteur = user !== null && commentaire.utilisateur_id === user.id;
              const estAdmin = user !== null && user.role === 'admin';
              return (
                <CommentItem
                  key={commentaire.id}
                  commentaire={commentaire}
                  peutModifier={estAuteur}
                  peutSupprimer={estAuteur || estAdmin}
                  onModifier={modifier}
                  onSupprimer={supprimer}
                />
              );
            })}
          </ul>

          {erreurAction && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {erreurAction}
            </p>
          )}

          <CommentForm peutEcrireNote={peutEcrireNote} onEnvoyer={envoyer} />
        </>
      )}
    </div>
  );
}