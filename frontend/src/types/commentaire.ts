import type { Role } from './user';

export type TypeCommentaire = 'public' | 'interne';

export interface Commentaire {
  id: number;
  ticket_id: number;
  utilisateur_id: number;
  auteur_nom: string;
  auteur_prenom: string | null;
  auteur_role: Role;
  contenu: string;
  type: TypeCommentaire;
  date_creation: string;
}

export interface NouveauCommentaire {
  ticket_id: number;
  contenu: string;
  type: TypeCommentaire;
}