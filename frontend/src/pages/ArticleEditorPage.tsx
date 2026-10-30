import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getArticle } from '../api/articleService';
import { getCategories } from '../api/referentielService';
import ArticleForm from '../components/articles/ArticleForm';
import { useAuth } from '../hooks/useAuth';
import { peutGererArticle } from '../utils/articles';
import { messageErreur } from '../utils/erreurs';
import type { ArticleDetail } from '../types/article';
import type { Categorie } from '../types/referentiel';

export default function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>();
  const edition = id !== undefined;
  const articleId = Number(id);
  const idValide = !edition || (Number.isInteger(articleId) && articleId >= 1);

  const { user } = useAuth();

  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!idValide) {
      return;
    }

    const charger = async () => {
      try {
        const [listeCategories, donneesArticle] = await Promise.all([
          getCategories(),
          edition ? getArticle(articleId) : Promise.resolve<ArticleDetail | null>(null),
        ]);
        setCategories(listeCategories);
        setArticle(donneesArticle);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger le formulaire.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, [edition, articleId, idValide]);

  const lienRetour = (
    <Link to="/base-connaissances" className="text-sm font-medium text-blue-700 hover:underline">
      ← Retour à la base de connaissances
    </Link>
  );

  const titre = edition ? "Modifier l'article" : 'Nouvel article';

  if (!idValide) {
    return (
      <div>
        {lienRetour}
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">Article invalide.</p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-slate-500">Chargement...</p>;
  }

  if (erreur) {
    return (
      <div>
        {lienRetour}
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      </div>
    );
  }

  if (article && !peutGererArticle(user, article.auteur_id)) {
    return (
      <div>
        {lienRetour}
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Vous ne pouvez modifier que vos propres articles.
        </p>
      </div>
    );
  }

  return (
    <div>
      {lienRetour}
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{titre}</h1>
      <ArticleForm article={article ?? undefined} categories={categories} />
    </div>
  );
}