import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TypeCommentaire } from '../../types/commentaire';

interface CommentFormProps {
  peutEcrireNote: boolean;
  onEnvoyer: (contenu: string, type: TypeCommentaire) => Promise<boolean>;
}

export default function CommentForm({ peutEcrireNote, onEnvoyer }: CommentFormProps) {
  const [contenu, setContenu] = useState<string>('');
  const [interne, setInterne] = useState<boolean>(false);
  const [envoi, setEnvoi] = useState<boolean>(false);

  const soumettre = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const texte = contenu.trim();
    if (texte === '') {
      return;
    }

    setEnvoi(true);
    try {
      const reussi = await onEnvoyer(texte, interne ? 'interne' : 'public');
      if (reussi) {
        setContenu('');
        setInterne(false);
      }
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <form onSubmit={soumettre} className="mt-6 border-t border-slate-100 pt-5">
      <label htmlFor="commentaire" className="block text-sm font-medium text-slate-700">
        Ajouter un commentaire
      </label>
      <textarea
        id="commentaire"
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        rows={3}
        maxLength={5000}
        placeholder="Écrivez votre message…"
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
      />

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
          disabled={envoi || contenu.trim() === ''}
          className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {envoi ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
}