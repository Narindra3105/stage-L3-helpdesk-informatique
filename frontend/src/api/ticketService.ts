import axiosClient from './axiosClient';
import type { Ticket } from '../types/ticket';

export const getTickets = async (): Promise<Ticket[]> => {
  const { data } = await axiosClient.get<Ticket[]>('/tickets');
  return data;
};

export const changerStatut = async (id: number, statutId: number): Promise<Ticket> => {
  const { data } = await axiosClient.patch<Ticket>(`/tickets/${id}/statut`, {
    statut_id: statutId,
  });
  return data;
};