import axiosClient from './axiosClient';
import type { Commentaire, NouveauCommentaire } from '../types/commentaire';

export const getCommentaires = async (ticketId: number): Promise<Commentaire[]> => {
  const { data } = await axiosClient.get<Commentaire[]>('/commentaires', {
    params: { ticket_id: ticketId },
  });
  return data;
};

export const creerCommentaire = async (payload: NouveauCommentaire): Promise<Commentaire> => {
  const { data } = await axiosClient.post<Commentaire>('/commentaires', payload);
  return data;
};

export const modifierCommentaire = async (id: number, contenu: string): Promise<Commentaire> => {
  const { data } = await axiosClient.put<Commentaire>(`/commentaires/${id}`, { contenu });
  return data;
};

export const supprimerCommentaire = async (id: number): Promise<void> => {
  await axiosClient.delete(`/commentaires/${id}`);
};