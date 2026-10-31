import { isToday } from 'date-fns';
import { estEnRetard } from './sla';
import type { Ticket } from '../types/ticket';

export const NIVEAU_PRIORITAIRE = 2;
const JOURS_MOYENNE = 30;
const MAX_A_SURVEILLER = 6;

export interface StatsTechnicien {
  ouverts: number;
  prioritaires: number;
  resolusAujourdhui: number;
  tempsMoyenMinutes: number | null;
  enRetard: Ticket[];
  aSurveiller: Ticket[];
}

const limiteMs = (ticket: Ticket): number => {
  return ticket.date_limite_resolution
    ? new Date(ticket.date_limite_resolution).getTime()
    : Infinity;
};

const dureeMinutes = (ticket: Ticket): number | null => {
  if (!ticket.date_resolution) {
    return null;
  }
  const debut = new Date(ticket.date_creation).getTime();
  const fin = new Date(ticket.date_resolution).getTime();
  return (fin - debut) / 60000;
};

export const calculerStatsTechnicien = (
  tickets: Ticket[],
  technicienId: number,
  niveaux: Map<number, number>
): StatsTechnicien => {
  const niveau = (ticket: Ticket): number => niveaux.get(ticket.priorite_id) ?? 99;

  const miens = tickets.filter((t) => t.technicien_id === technicienId);
  const ouverts = miens.filter((t) => !t.est_final);
  const termines = miens.filter((t) => Boolean(t.est_final));

  const depuis = Date.now() - JOURS_MOYENNE * 24 * 60 * 60 * 1000;
  const durees = termines
    .filter((t) => t.date_resolution !== null && new Date(t.date_resolution).getTime() >= depuis)
    .map(dureeMinutes)
    .filter((d): d is number => d !== null);

  const parUrgence = [...ouverts].sort((a, b) => {
    const limiteA = limiteMs(a);
    const limiteB = limiteMs(b);
    if (limiteA !== limiteB) {
      return limiteA < limiteB ? -1 : 1;
    }
    return niveau(a) - niveau(b);
  });

  return {
    ouverts: ouverts.length,
    prioritaires: ouverts.filter((t) => niveau(t) <= NIVEAU_PRIORITAIRE).length,
    resolusAujourdhui: termines.filter(
      (t) => t.date_resolution !== null && isToday(new Date(t.date_resolution))
    ).length,
    tempsMoyenMinutes:
      durees.length === 0
        ? null
        : Math.round(durees.reduce((somme, d) => somme + d, 0) / durees.length),
    enRetard: parUrgence.filter(estEnRetard),
    aSurveiller: parUrgence.slice(0, MAX_A_SURVEILLER),
  };
};