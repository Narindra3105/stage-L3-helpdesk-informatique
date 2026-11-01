import { eachDayOfInterval, endOfWeek, format, isSameDay, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { resolutionDansLesDelais } from './sla';
import type { Ticket } from '../types/ticket';

export interface JourActivite {
  jour: string;
  resolus: number;
}

export interface CategorieActivite {
  nom: string;
  nombre: number;
}

export interface ActiviteTechnicien {
  periode: string;
  resolus: number;
  respectSla: number | null;
  tempsMoyenMinutes: number | null;
  parJour: JourActivite[];
  parCategorie: CategorieActivite[];
}

const libelleJour = (jour: Date): string => {
  const texte = format(jour, 'EEE', { locale: fr }).replace('.', '');
  return texte.charAt(0).toUpperCase() + texte.slice(1);
};

export const calculerActiviteTechnicien = (
  tickets: Ticket[],
  technicienId: number
): ActiviteTechnicien => {
  const maintenant = new Date();
  const debut = startOfWeek(maintenant, { weekStartsOn: 1 });
  const fin = endOfWeek(maintenant, { weekStartsOn: 1 });

  const resolusSemaine = tickets.flatMap((ticket) => {
    if (
      ticket.technicien_id !== technicienId ||
      !ticket.est_final ||
      ticket.date_resolution === null
    ) {
      return [];
    }
    const date = new Date(ticket.date_resolution);
    return date >= debut && date <= fin ? [{ ticket, date }] : [];
  });

  const verdicts = resolusSemaine
    .map(({ ticket }) => resolutionDansLesDelais(ticket))
    .filter((verdict): verdict is boolean => verdict !== null);

  const durees = resolusSemaine.map(
    ({ ticket, date }) => (date.getTime() - new Date(ticket.date_creation).getTime()) / 60000
  );

  const parJour = eachDayOfInterval({ start: debut, end: fin }).map((jour) => ({
    jour: libelleJour(jour),
    resolus: resolusSemaine.filter(({ date }) => isSameDay(date, jour)).length,
  }));

  const compteurs = new Map<string, number>();
  resolusSemaine.forEach(({ ticket }) => {
    const nom = ticket.categorie_nom ?? 'Sans catégorie';
    compteurs.set(nom, (compteurs.get(nom) ?? 0) + 1);
  });
  const parCategorie = Array.from(compteurs, ([nom, nombre]) => ({ nom, nombre })).sort(
    (a, b) => b.nombre - a.nombre || a.nom.localeCompare(b.nom)
  );

  return {
    periode: `Du ${format(debut, 'dd/MM')} au ${format(fin, 'dd/MM')}`,
    resolus: resolusSemaine.length,
    respectSla:
      verdicts.length === 0
        ? null
        : Math.round((verdicts.filter(Boolean).length / verdicts.length) * 100),
    tempsMoyenMinutes:
      durees.length === 0
        ? null
        : Math.round(durees.reduce((somme, duree) => somme + duree, 0) / durees.length),
    parJour,
    parCategorie,
  };
};