export type UniteDelai = 'min' | 'h' | 'j';

const FACTEURS: Record<UniteDelai, number> = {
  min: 1,
  h: 60,
  j: 1440,
};

export const versMinutes = (valeur: number, unite: UniteDelai): number => {
  return valeur * FACTEURS[unite];
};

export const decomposerDelai = (minutes: number): { valeur: number; unite: UniteDelai } => {
  if (minutes % FACTEURS.j === 0) {
    return { valeur: minutes / FACTEURS.j, unite: 'j' };
  }
  if (minutes % FACTEURS.h === 0) {
    return { valeur: minutes / FACTEURS.h, unite: 'h' };
  }
  return { valeur: minutes, unite: 'min' };
};