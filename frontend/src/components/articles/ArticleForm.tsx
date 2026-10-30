import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { creerArticle, modifierArticle } from '../../api/articleService';
import { infosStatutArticle, listeStatutsArticle } from '../../utils/articles';
import { erreursChamps, messageErreur } from '../../utils/erreurs';
import { classeChamp, classeLabel } from '../../utils/styles';
import type { ArticleDetail, ArticlePayload, StatutArticle } from '../../types/article';
import type { Categorie } from '../../types/referentiel';

interface FormulaireArticle {
  titre: string;
  categorie_id: string;
  statut: StatutArticle;
  contenu: string;
}

interface ArticleFormProps {
  article?: ArticleDetail;
  categories: Categorie[];
}

const champsConnus: string[] = ['titre', 'categorie_id', 'statut', 'contenu'];

const estChampConnu = (champ: string): champ is keyof FormulaireArticle => {
  return champsConnus.includes(champ);
};

export default function ArticleForm({ article, categories }: ArticleFormProps) {
  const edition = article !== undefined;
  const navigate = useNavigate();
  const [erreur, setErreur] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormulaireArticle>({
    defaultValues: {
      titre: article ? article.titre : '',
      categorie_id: article ? String(article.categorie_id) : '',
      statut: article ? article.statut : 'brouillon',
      contenu: article ? article.contenu : '',
    },
  });

  const onSubmit = async (data: FormulaireArticle) => {
    setErreur(null);

    const payload: ArticlePayload = {
      titre: data.titre.trim(),
      contenu: data.contenu.trim(),
      categorie_id: Number(data.categorie_id),
      statut: data.statut,
    };

    try {
      const enregistre = article
        ? await modifierArticle(article.id, payload)
        : await creerArticle(payload);
      navigate(`/base-connaissances/${enregistre.id}`);
    } catch (e) {
      let champAssocie = false;
      for (const { champ, message } of erreursChamps(e)) {
        if (estChampConnu(champ)) {
          setError(champ, { message });
          champAssocie = true;
        }
      }
      if (!champAssocie) {
        setErreur(
          messageErreur(
            e,
            edition ? "Impossible de modifier l'article." : "Impossible de créer l'article."
          )
        );
      }
    }
  };

  const lienAnnuler = article ? `/base-connaissances/${article.id}` : '/base-connaissances';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-6 max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div>
        <label htmlFor="titre" className={classeLabel}>
          Titre
        </label>
        <input
          id="titre"
          type="text"
          placeholder="Ex. Réinitialiser le mot de passe de la messagerie"
          className={classeChamp}
          {...register('titre', {
            required: 'Le titre est obligatoire',
            maxLength: { value: 200, message: 'Le titre ne doit pas dépasser 200 caractères' },
          })}
        />
        {errors.titre && <p className="mt-1 text-sm text-red-600">{errors.titre.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="categorie_id" className={classeLabel}>
            Catégorie
          </label>
          <select
            id="categorie_id"
            className={classeChamp}
            {...register('categorie_id', { required: 'La catégorie est obligatoire' })}
          >
            <option value="">Choisir…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
          {errors.categorie_id && (
            <p className="mt-1 text-sm text-red-600">{errors.categorie_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="statut" className={classeLabel}>
            Statut
          </label>
          <select id="statut" className={classeChamp} {...register('statut')}>
            {listeStatutsArticle.map((s) => (
              <option key={s} value={s}>
                {infosStatutArticle[s].libelle}
              </option>
            ))}
          </select>
          {errors.statut && <p className="mt-1 text-sm text-red-600">{errors.statut.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="contenu" className={classeLabel}>
          Contenu
        </label>
        <textarea
          id="contenu"
          rows={16}
          placeholder="Décrivez la procédure étape par étape…"
          className={`${classeChamp} leading-relaxed`}
          {...register('contenu', { required: 'Le contenu est obligatoire' })}
        />
        {errors.contenu && <p className="mt-1 text-sm text-red-600">{errors.contenu.message}</p>}
      </div>

      <p className="text-xs text-slate-500">
        Le contenu est affiché tel quel : utilisez des sauts de ligne pour structurer les étapes. Un
        brouillon n'est visible que par les administrateurs et les techniciens, un article publié
        l'est par tous.
      </p>

      {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Enregistrement...' : edition ? 'Enregistrer' : "Créer l'article"}
        </button>
        <Link
          to={lienAnnuler}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}