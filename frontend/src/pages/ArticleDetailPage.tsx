import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getArticle, supprimerArticle } from '../api/articleService';
import Badge from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import { infosStatutArticle, peutGererArticle } from '../utils/articles';
import { formatDateHeure } from '../utils/date';
import { messageErreur } from '../utils/erreurs';
import { nomComplet } from '../utils/format';
import type { ArticleDetail } from '../types/article';

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const articleId = Number(id);
  const idValide = Number.isInteger(articleId) && articleId >= 1;

  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurAction, setErreurAction] = useState<string | null>(null);

  useEffect(() => {
    if (!idValide) {
      return;
    }

    const charger = async () => {
      try {
        const donnees = await getArticle(articleId);
        setArticle(donnees);
      } catch (e) {
        setErreur(messageErreur(e, "Impossible de charger l'article."));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, [articleId, idValide]);

  const supprimer = async () => {
    if (!article) {
      return;
    }
    if (!window.confirm(`Supprimer l'article « ${article.titre} » ?`)) {
      return;
    }

    setErreurAction(null);
    try {
      await supprimerArticle(article.id);
      navigate('/base-connaissances');
    } catch (e) {
      setErreurAction(messageErreur(e, "Impossible de supprimer l'article."));
    }
  };

  const lienRetour = (
    <Link to="/base-connaissances" className="text-sm font-medium text-blue-700 hover:underline">
      ← Retour à la base de connaissances
    </Link>
  );

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

  if (erreur || !article) {
    return (
      <div>
        {lienRetour}
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {erreur ?? 'Article introuvable.'}
        </p>
      </div>
    );
  }

  const statut = infosStatutArticle[article.statut];
  const peutGerer = peutGererArticle(user, article.auteur_id);

  return (
    <div>
      {lienRetour}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge couleur="bleu">{article.categorie_nom}</Badge>
        <Badge couleur={statut.couleur}>{statut.libelle}</Badge>
      </div>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">{article.titre}</h1>

      <p className="mt-2 text-sm text-slate-500">
        Par {nomComplet(article.auteur_prenom, article.auteur_nom)} · Mis à jour le{' '}
        {formatDateHeure(article.date_maj)} · {article.nb_vues} vue
        {article.nb_vues > 1 ? 's' : ''}
      </p>

      {peutGerer && (
        <div className="mt-4 flex gap-3">
          <Link
            to={`/base-connaissances/${article.id}/modifier`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Modifier
          </Link>
          <button
            onClick={supprimer}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Supprimer
          </button>
        </div>
      )}

      {erreurAction && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreurAction}</p>
      )}

      <div className="mt-6 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-700">
        {article.contenu}
      </div>
    </div>
  );
}