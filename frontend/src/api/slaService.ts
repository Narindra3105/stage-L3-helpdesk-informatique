import axiosClient from './axiosClient';
import type { Sla, SlaPayload } from '../types/sla';

export const getSlas = async (): Promise<Sla[]> => {
  const { data } = await axiosClient.get<Sla[]>('/sla');
  return data;
};

export const creerSla = async (payload: SlaPayload): Promise<Sla> => {
  const { data } = await axiosClient.post<Sla>('/sla', payload);
  return data;
};

export const modifierSla = async (id: number, payload: SlaPayload): Promise<Sla> => {
  const { data } = await axiosClient.put<Sla>(`/sla/${id}`, payload);
  return data;
};

export const supprimerSla = async (id: number): Promise<void> => {
  await axiosClient.delete(`/sla/${id}`);
};