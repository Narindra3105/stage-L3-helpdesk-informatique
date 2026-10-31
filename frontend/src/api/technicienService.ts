import axiosClient from './axiosClient';
import type { TechnicienActif } from '../types/technicien';

export const getTechniciensActifs = async (): Promise<TechnicienActif[]> => {
  const { data } = await axiosClient.get<TechnicienActif[]>('/techniciens/actifs');
  return data;
};