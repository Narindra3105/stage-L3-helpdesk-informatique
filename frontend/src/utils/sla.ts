import { isToday } from 'date-fns';
import { formatDate } from './date';
import { formatDuree } from './format';
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

export const texteSlaCourt = (ticket: Ticket): string => {
  if (ticket.est_final) {
    if (!ticket.date_resolution) {
      return 'Résolu';
    }
    return isToday(new Date(ticket.date_resolution))
      ? "Résolu aujourd'hui"
      : `Résolu le ${formatDate(ticket.date_resolution)}`;
  }

  const delai = calculerDelai(ticket);
  if (delai === null) {
    return 'Sans délai SLA';
  }
  if (delai.restantMinutes < 0) {
    return 'SLA dépassé';
  }
  return formatDuree(delai.restantMinutes);
};