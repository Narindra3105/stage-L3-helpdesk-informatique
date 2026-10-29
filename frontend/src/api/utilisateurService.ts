import axiosClient from './axiosClient';
import type {
  NouvelUtilisateurPayload,
  Utilisateur,
  UtilisateurPayload,
} from '../types/user';

export const getUtilisateurs = async (): Promise<Utilisateur[]> => {
  const { data } = await axiosClient.get<Utilisateur[]>('/utilisateurs');
  return data;
};

export const creerUtilisateur = async (payload: NouvelUtilisateurPayload): Promise<Utilisateur> => {
  const { data } = await axiosClient.post<Utilisateur>('/utilisateurs', payload);
  return data;
};

export const modifierUtilisateur = async (
  id: number,
  payload: UtilisateurPayload
): Promise<Utilisateur> => {
  const { data } = await axiosClient.put<Utilisateur>(`/utilisateurs/${id}`, payload);
  return data;
};