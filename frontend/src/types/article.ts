export type StatutArticle = 'publie' | 'brouillon';

export interface Article {
  id: number;
  titre: string;
  categorie_id: number;
  categorie_nom: string;
  auteur_id: number;
  auteur_nom: string;
  auteur_prenom: string | null;
  statut: StatutArticle;
  nb_vues: number;
  taux_utilite: string | null;
  date_creation: string;
  date_maj: string;
}

export interface ArticleDetail extends Article {
  contenu: string;
}

export interface ArticlePayload {
  titre: string;
  contenu: string;
  categorie_id: number;
  statut: StatutArticle;
}