export interface Statut {
  id: number;
  nom: string;
  ordre: number;
  est_final: number;
}

export interface StatutPayload {
  nom: string;
  ordre: number;
  est_final: boolean;
}

export interface Priorite {
  id: number;
  nom: string;
  niveau_ordre: number;
  couleur: string | null;
}

export interface PrioritePayload {
  nom: string;
  niveau_ordre: number;
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