import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TypeCommentaire } from '../../types/commentaire';

type VarianteFormulaire = 'simple' | 'boutons';

interface CommentFormProps {
  peutEcrireNote: boolean;
  variante?: VarianteFormulaire;
  onEnvoyer: (contenu: string, type: TypeCommentaire) => Promise<boolean>;
}

export default function CommentForm({
  peutEcrireNote,
  variante = 'simple',
  onEnvoyer,
}: CommentFormProps) {
  const [contenu, setContenu] = useState<string>('');
  const [interne, setInterne] = useState<boolean>(false);
  const [envoi, setEnvoi] = useState<boolean>(false);

  const envoyer = async (type: TypeCommentaire) => {
    const texte = contenu.trim();
    if (texte === '') {
      return;
    }

    setEnvoi(true);
    try {
      const reussi = await onEnvoyer(texte, type);
      if (reussi) {
        setContenu('');
        setInterne(false);
      }
    } finally {
      setEnvoi(false);
    }
  };

  const soumettre = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (variante === 'simple') {
      envoyer(interne ? 'interne' : 'public');
    }
  };

  const vide = contenu.trim() === '';

  return (
    <form onSubmit={soumettre} className="mt-6 border-t border-slate-100 pt-5">
      <label htmlFor="commentaire" className="block text-sm font-medium text-slate-700">
        {variante === 'boutons' ? 'Votre message' : 'Ajouter un commentaire'}
      </label>
      <textarea
        id="commentaire"
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        rows={3}
        maxLength={5000}
        placeholder={
          variante === 'boutons'
            ? 'Répondre au demandeur ou ajouter une note interne…'
            : 'Écrivez votre message…'
        }
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
      />

      {variante === 'boutons' ? (
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={() => envoyer('public')}
            disabled={envoi || vide}
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            Répondre
          </button>
          {peutEcrireNote && (
            <button
              type="button"
              onClick={() => envoyer('interne')}
              disabled={envoi || vide}
              className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-60"
            >
              Note interne
            </button>
          )}
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-4">
          {peutEcrireNote ? (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={interne}
                onChange={(e) => setInterne(e.target.checked)}
              />
              Note interne (invisible pour le demandeur)
            </label>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={envoi || vide}
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {envoi ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      )}
    </form>
  );
}