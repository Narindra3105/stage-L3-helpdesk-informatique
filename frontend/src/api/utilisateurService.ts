import axiosClient from './axiosClient';
import type { Utilisateur } from '../types/user';

export const getUtilisateurs = async (): Promise<Utilisateur[]> => {
  const { data } = await axiosClient.get<Utilisateur[]>('/utilisateurs');
  return data;
};