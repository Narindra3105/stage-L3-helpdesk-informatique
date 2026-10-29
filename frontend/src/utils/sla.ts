import type { Ticket } from '../types/ticket';

export const estEnRetard = (ticket: Ticket): boolean => {
  if (ticket.est_final || !ticket.date_limite_resolution) {
    return false;
  }
  return new Date(ticket.date_limite_resolution) < new Date();
};