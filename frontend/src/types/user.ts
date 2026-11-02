export type Role = 'admin' | 'technicien' | 'demandeur';

export type StatutUtilisateur = 'actif' | 'absent' | 'inactif';

export type StatutDisponibilite = 'actif' | 'absent';

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string | null;
  email: string;
  role: Role;
  equipe_id: number | null;
  statut: StatutUtilisateur;
  derniere_activite: string | null;
  date_creation: string;
}

export interface UtilisateurPayload {
  nom: string;
  prenom: string | null;
  email: string;
  role: Role;
  equipe_id: number | null;
  statut: StatutUtilisateur;
}

export interface NouvelUtilisateurPayload extends UtilisateurPayload {
  mdp: string;
}

export interface ProfilPayload {
  nom: string;
  prenom: string | null;
  email: string;
}

export interface ChangementMdpPayload {
  mdp_actuel: string;
  nouveau_mdp: string;
}