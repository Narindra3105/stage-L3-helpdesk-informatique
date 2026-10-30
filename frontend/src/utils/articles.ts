import type { CouleurBadge } from '../components/common/Badge';
import type { StatutArticle } from '../types/article';
import type { Utilisateur } from '../types/user';

export const listeStatutsArticle: StatutArticle[] = ['publie', 'brouillon'];

export const infosStatutArticle: Record<StatutArticle, { libelle: string; couleur: CouleurBadge }> =
  {
    publie: { libelle: 'Publié', couleur: 'vert' },
    brouillon: { libelle: 'Brouillon', couleur: 'orange' },
  };

export const peutEcrireArticles = (user: Utilisateur | null): boolean => {
  return user !== null && (user.role === 'admin' || user.role === 'technicien');
};

export const peutGererArticle = (user: Utilisateur | null, auteurId: number): boolean => {
  if (user === null) {
    return false;
  }
  if (user.role === 'admin') {
    return true;
  }
  return user.role === 'technicien' && user.id === auteurId;
};