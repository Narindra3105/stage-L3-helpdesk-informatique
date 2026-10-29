import axiosClient from './axiosClient';
import type { Priorite, Statut } from '../types/referentiel';

export const getStatuts = async (): Promise<Statut[]> => {
  const { data } = await axiosClient.get<Statut[]>('/statuts');
  return data;
};

export const getPriorites = async (): Promise<Priorite[]> => {
  const { data } = await axiosClient.get<Priorite[]>('/priorites');
  return data;
};