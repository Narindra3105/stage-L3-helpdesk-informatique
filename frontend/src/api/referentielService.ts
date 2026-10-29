import axiosClient from './axiosClient';
import type { Categorie, Equipe, Priorite, Statut } from '../types/referentiel';

export const getStatuts = async (): Promise<Statut[]> => {
  const { data } = await axiosClient.get<Statut[]>('/statuts');
  return data;
};

export const getPriorites = async (): Promise<Priorite[]> => {
  const { data } = await axiosClient.get<Priorite[]>('/priorites');
  return data;
};

export const getCategories = async (): Promise<Categorie[]> => {
  const { data } = await axiosClient.get<Categorie[]>('/categories');
  return data;
};

export const getEquipes = async (): Promise<Equipe[]> => {
  const { data } = await axiosClient.get<Equipe[]>('/equipes');
  return data;
};

export const creerCategorie = async (nom: string): Promise<Categorie> => {
  const { data } = await axiosClient.post<Categorie>('/categories', { nom });
  return data;
};

export const supprimerCategorie = async (id: number): Promise<void> => {
  await axiosClient.delete(`/categories/${id}`);
};