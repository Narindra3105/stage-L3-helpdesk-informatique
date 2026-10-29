import axiosClient from './axiosClient';
import type { NouveauTicketPayload, Ticket } from '../types/ticket';

export const getTickets = async (): Promise<Ticket[]> => {
  const { data } = await axiosClient.get<Ticket[]>('/tickets');
  return data;
};

export const getTicket = async (id: number): Promise<Ticket> => {
  const { data } = await axiosClient.get<Ticket>(`/tickets/${id}`);
  return data;
};

export const creerTicket = async (payload: NouveauTicketPayload): Promise<Ticket> => {
  const { data } = await axiosClient.post<Ticket>('/tickets', payload);
  return data;
};

export const changerStatut = async (id: number, statutId: number): Promise<Ticket> => {
  const { data } = await axiosClient.patch<Ticket>(`/tickets/${id}/statut`, {
    statut_id: statutId,
  });
  return data;
};

export const assignerTicket = async (
  id: number,
  technicienId: number | null
): Promise<Ticket> => {
  const { data } = await axiosClient.patch<Ticket>(`/tickets/${id}/assignation`, {
    technicien_id: technicienId,
  });
  return data;
};