import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/date';
import { nomComplet } from '../../utils/format';
import { infosStatutArticle } from '../../utils/articles';
import type { Article } from '../../types/article';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const statut = infosStatutArticle[article.statut];

  return (
    <Link
      to={`/base-connaissances/${article.id}`}
      className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge couleur="bleu">{article.categorie_nom}</Badge>
        {article.statut === 'brouillon' && <Badge couleur={statut.couleur}>{statut.libelle}</Badge>}
      </div>

      <h2 className="mt-3 text-base font-semibold text-slate-900">{article.titre}</h2>

      <p className="mt-auto pt-4 text-xs text-slate-500">
        Par {nomComplet(article.auteur_prenom, article.auteur_nom)} · Mis à jour le{' '}
        {formatDate(article.date_maj)} · {article.nb_vues} vue{article.nb_vues > 1 ? 's' : ''}
      </p>
    </Link>
  );
}