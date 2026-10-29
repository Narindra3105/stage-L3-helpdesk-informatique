import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import { creerCategorie, getCategories, supprimerCategorie } from '../../api/referentielService';
import { messageErreur } from '../../utils/erreurs';
import type { Categorie } from '../../types/referentiel';

const trierParNom = (liste: Categorie[]): Categorie[] => {
  return [...liste].sort((a, b) => a.nom.localeCompare(b.nom));
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurAction, setErreurAction] = useState<string | null>(null);
  const [nom, setNom] = useState<string>('');
  const [ajout, setAjout] = useState<boolean>(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const liste = await getCategories();
        setCategories(trierParNom(liste));
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger les catégories.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, []);

  const ajouter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const texte = nom.trim();
    if (texte === '') {
      return;
    }

    setErreurAction(null);
    setAjout(true);
    try {
      const cree = await creerCategorie(texte);
      setCategories((prev) => trierParNom([...prev, cree]));
      setNom('');
    } catch (e) {
      setErreurAction(messageErreur(e, "Impossible d'ajouter la catégorie."));
    } finally {
      setAjout(false);
    }
  };

  const supprimer = async (categorie: Categorie) => {
    if (!window.confirm(`Supprimer la catégorie « ${categorie.nom} » ?`)) {
      return;
    }

    setErreurAction(null);
    try {
      await supprimerCategorie(categorie.id);
      setCategories((prev) => prev.filter((c) => c.id !== categorie.id));
    } catch (e) {
      setErreurAction(messageErreur(e, 'Impossible de supprimer la catégorie.'));
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Catégories</h2>
      <p className="mt-1 text-sm text-slate-500">
        Utilisées pour classer les tickets et les articles de la base de connaissances.
      </p>

      {loading && <p className="mt-4 text-sm text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {!loading && !erreur && (
        <>
          {categories.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Aucune catégorie pour le moment.</p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {categories.map((categorie) => (
                <li
                  key={categorie.id}
                  className="flex items-center gap-1.5 rounded-full bg-slate-100 py-1.5 pl-3.5 pr-2 text-sm text-slate-700"
                >
                  {categorie.nom}
                  <button
                    onClick={() => supprimer(categorie)}
                    title="Supprimer"
                    aria-label={`Supprimer ${categorie.nom}`}
                    className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {erreurAction && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {erreurAction}
            </p>
          )}

          <form onSubmit={ajouter} className="mt-5 flex gap-3">
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              maxLength={100}
              placeholder="Nouvelle catégorie"
              aria-label="Nouvelle catégorie"
              className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
            <button
              type="submit"
              disabled={ajout || nom.trim() === ''}
              className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {ajout ? 'Ajout...' : 'Ajouter'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}