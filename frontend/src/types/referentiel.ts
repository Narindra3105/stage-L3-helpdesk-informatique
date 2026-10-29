export interface Statut {
  id: number;
  nom: string;
  ordre: number;
  est_final: number;
}

export interface Priorite {
  id: number;
  nom: string;
  couleur: string;
}

export interface Categorie {
  id: number;
  nom: string;
}

export interface Equipe {
  id: number;
  nom: string;
}