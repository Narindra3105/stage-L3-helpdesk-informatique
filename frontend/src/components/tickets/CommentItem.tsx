import { useState } from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { formatDateHeure } from '../../utils/date';
import { initiales, nomComplet } from '../../utils/format';
import { libellesRole } from '../../utils/roles';
import type { Commentaire } from '../../types/commentaire';

interface CommentItemProps {
  commentaire: Commentaire;
  peutModifier: boolean;
  peutSupprimer: boolean;
  onModifier: (id: number, contenu: string) => Promise<boolean>;
  onSupprimer: (id: number) => Promise<void>;
}

export default function CommentItem({
  commentaire,
  peutModifier,
  peutSupprimer,
  onModifier,
  onSupprimer,
}: CommentItemProps) {
  const [edition, setEdition] = useState<boolean>(false);
  const [texte, setTexte] = useState<string>(commentaire.contenu);
  const [occupe, setOccupe] = useState<boolean>(false);

  const interne = commentaire.type === 'interne';
  const auteur = nomComplet(commentaire.auteur_prenom, commentaire.auteur_nom);

  const annuler = () => {
    setTexte(commentaire.contenu);
    setEdition(false);
  };

  const enregistrer = async () => {
    const nouveau = texte.trim();
    if (nouveau === '') {
      return;
    }
    if (nouveau === commentaire.contenu) {
      setEdition(false);
      return;
    }

    setOccupe(true);
    try {
      const reussi = await onModifier(commentaire.id, nouveau);
      if (reussi) {
        setEdition(false);
      }
    } finally {
      setOccupe(false);
    }
  };

  const supprimer = async () => {
    if (!window.confirm('Supprimer ce commentaire ?')) {
      return;
    }
    setOccupe(true);
    try {
      await onSupprimer(commentaire.id);
    } finally {
      setOccupe(false);
    }
  };

  return (
    <li className="flex gap-3">
      <Avatar texte={initiales(commentaire.auteur_prenom, commentaire.auteur_nom)} />

      <div
        className={`min-w-0 flex-1 rounded-xl border p-3.5 ${
          interne ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{auteur}</span>
          <span className="text-xs text-slate-500">{libellesRole[commentaire.auteur_role]}</span>
          {interne && <Badge couleur="orange">Note interne</Badge>}
          <span className="ml-auto text-xs text-slate-400">
            {formatDateHeure(commentaire.date_creation)}
          </span>
        </div>

        {edition ? (
          <div className="mt-2">
            <textarea
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              rows={3}
              maxLength={5000}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={enregistrer}
                disabled={occupe || texte.trim() === ''}
                className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
              >
                Enregistrer
              </button>
              <button
                onClick={annuler}
                disabled={occupe}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{commentaire.contenu}</p>
        )}

        {!edition && (peutModifier || peutSupprimer) && (
          <div className="mt-2 flex gap-3 text-xs">
            {peutModifier && (
              <button
                onClick={() => setEdition(true)}
                disabled={occupe}
                className="font-medium text-blue-700 hover:underline"
              >
                Modifier
              </button>
            )}
            {peutSupprimer && (
              <button
                onClick={supprimer}
                disabled={occupe}
                className="font-medium text-red-600 hover:underline"
              >
                Supprimer
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}