import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../api/articleService';
import { getCategories } from '../api/referentielService';
import ArticleCard from '../components/articles/ArticleCard';
import { useAuth } from '../hooks/useAuth';
import { infosStatutArticle, listeStatutsArticle, peutEcrireArticles } from '../utils/articles';
import { messageErreur } from '../utils/erreurs';
import { classeChamp } from '../utils/styles';
import type { Article } from '../types/article';
import type { Categorie } from '../types/referentiel';

export default function ArticlesPage() {
  const { user } = useAuth();
  const peutEcrire = peutEcrireArticles(user);

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const [recherche, setRecherche] = useState<string>('');
  const [categorieFiltre, setCategorieFiltre] = useState<string>('');
  const [statutFiltre, setStatutFiltre] = useState<string>('');

  useEffect(() => {
    const charger = async () => {
      try {
        const [listeArticles, listeCategories] = await Promise.all([
          getArticles(),
          getCategories(),
        ]);
        setArticles(listeArticles);
        setCategories(listeCategories);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger les articles.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, []);

  const articlesFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return articles.filter((a) => {
      if (terme && !a.titre.toLowerCase().includes(terme)) {
        return false;
      }
      if (categorieFiltre && String(a.categorie_id) !== categorieFiltre) {
        return false;
      }
      if (statutFiltre && a.statut !== statutFiltre) {
        return false;
      }
      return true;
    });
  }, [articles, recherche, categorieFiltre, statutFiltre]);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Base de connaissances</h1>
          <p className="mt-1 text-sm text-slate-500">
            Articles et procédures pour résoudre les incidents courants
          </p>
        </div>
        {peutEcrire && (
          <Link
            to="/base-connaissances/nouveau"
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Nouvel article
          </Link>
        )}
      </div>

      {loading && <p className="mt-8 text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {!loading && !erreur && (
        <>
          <div className="mt-6 flex flex-wrap gap-3">
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un article"
              aria-label="Rechercher un article"
              className={`${classeChamp} mt-0 w-full sm:w-72`}
            />
            <select
              value={categorieFiltre}
              onChange={(e) => setCategorieFiltre(e.target.value)}
              aria-label="Filtrer par catégorie"
              className={`${classeChamp} mt-0 w-auto`}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
            {peutEcrire && (
              <select
                value={statutFiltre}
                onChange={(e) => setStatutFiltre(e.target.value)}
                aria-label="Filtrer par statut"
                className={`${classeChamp} mt-0 w-auto`}
              >
                <option value="">Tous les statuts</option>
                {listeStatutsArticle.map((s) => (
                  <option key={s} value={s}>
                    {infosStatutArticle[s].libelle}
                  </option>
                ))}
              </select>
            )}
          </div>

          {articlesFiltres.length === 0 ? (
            <p className="mt-8 text-sm text-slate-500">Aucun article ne correspond.</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {articlesFiltres.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}