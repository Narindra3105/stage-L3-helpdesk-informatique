import axiosClient from './axiosClient';
import type {
  Categorie,
  Equipe,
  Priorite,
  PrioritePayload,
  Statut,
  StatutPayload,
} from '../types/referentiel';

export const getStatuts = async (): Promise<Statut[]> => {
  const { data } = await axiosClient.get<Statut[]>('/statuts');
  return data;
};

export const creerStatut = async (payload: StatutPayload): Promise<Statut> => {
  const { data } = await axiosClient.post<Statut>('/statuts', payload);
  return data;
};

export const modifierStatut = async (id: number, payload: StatutPayload): Promise<Statut> => {
  const { data } = await axiosClient.put<Statut>(`/statuts/${id}`, payload);
  return data;
};

export const supprimerStatut = async (id: number): Promise<void> => {
  await axiosClient.delete(`/statuts/${id}`);
};

export const getPriorites = async (): Promise<Priorite[]> => {
  const { data } = await axiosClient.get<Priorite[]>('/priorites');
  return data;
};

export const creerPriorite = async (payload: PrioritePayload): Promise<Priorite> => {
  const { data } = await axiosClient.post<Priorite>('/priorites', payload);
  return data;
};

export const modifierPriorite = async (
  id: number,
  payload: PrioritePayload
): Promise<Priorite> => {
  const { data } = await axiosClient.put<Priorite>(`/priorites/${id}`, payload);
  return data;
};

export const supprimerPriorite = async (id: number): Promise<void> => {
  await axiosClient.delete(`/priorites/${id}`);
};

export const getCategories = async (): Promise<Categorie[]> => {
  const { data } = await axiosClient.get<Categorie[]>('/categories');
  return data;
};

export const creerCategorie = async (nom: string): Promise<Categorie> => {
  const { data } = await axiosClient.post<Categorie>('/categories', { nom });
  return data;
};

export const supprimerCategorie = async (id: number): Promise<void> => {
  await axiosClient.delete(`/categories/${id}`);
};

export const getEquipes = async (): Promise<Equipe[]> => {
  const { data } = await axiosClient.get<Equipe[]>('/equipes');
  return data;
};