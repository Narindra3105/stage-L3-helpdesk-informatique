import type { Statut } from '../types/referentiel';

export const trouverStatutParNom = (statuts: Statut[], nom: string): Statut | undefined => {
  return statuts.find((s) => s.nom.toLowerCase() === nom.toLowerCase());
};