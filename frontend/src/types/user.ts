export type Role = 'admin' | 'technicien' | 'demandeur';

export type StatutUtilisateur = 'actif' | 'absent' | 'inactif';

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