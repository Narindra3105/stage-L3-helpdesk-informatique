import type { Ticket } from '../types/ticket';

export interface DelaiSla {
  totalMinutes: number;
  restantMinutes: number;
}

export const estEnRetard = (ticket: Ticket): boolean => {
  if (ticket.est_final || !ticket.date_limite_resolution) {
    return false;
  }
  return new Date(ticket.date_limite_resolution) < new Date();
};

export const calculerDelai = (ticket: Ticket): DelaiSla | null => {
  if (!ticket.date_limite_resolution) {
    return null;
  }
  const creation = new Date(ticket.date_creation).getTime();
  const limite = new Date(ticket.date_limite_resolution).getTime();
  return {
    totalMinutes: Math.round((limite - creation) / 60000),
    restantMinutes: Math.round((limite - Date.now()) / 60000),
  };
};

export const resolutionDansLesDelais = (ticket: Ticket): boolean | null => {
  if (!ticket.date_resolution || !ticket.date_limite_resolution) {
    return null;
  }
  return new Date(ticket.date_resolution) <= new Date(ticket.date_limite_resolution);
};