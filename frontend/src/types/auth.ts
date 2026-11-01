import type { Utilisateur } from './user';

export interface LoginPayload {
  email: string;
  mdp: string;
}

export interface LoginResponse {
  token: string;
  utilisateur: Utilisateur;
}

export interface RegisterPayload {
  nom: string;
  prenom: string | null;
  email: string;
  mdp: string;
}