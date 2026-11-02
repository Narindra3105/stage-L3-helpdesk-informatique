import axiosClient from './axiosClient';
import type {
  ChangementMdpPayload,
  ProfilPayload,
  StatutDisponibilite,
  Utilisateur,
} from '../types/user';

export const getProfil = async (): Promise<Utilisateur> => {
  const { data } = await axiosClient.get<Utilisateur>('/profil');
  return data;
};

export const modifierProfil = async (payload: ProfilPayload): Promise<Utilisateur> => {
  const { data } = await axiosClient.put<Utilisateur>('/profil', payload);
  return data;
};

export const changerDisponibilite = async (statut: StatutDisponibilite): Promise<Utilisateur> => {
  const { data } = await axiosClient.patch<Utilisateur>('/profil/disponibilite', { statut });
  return data;
};

export const changerMotDePasse = async (payload: ChangementMdpPayload): Promise<void> => {
  await axiosClient.patch('/profil/mdp', payload);
};