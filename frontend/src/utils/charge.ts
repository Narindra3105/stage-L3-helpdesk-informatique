export const CAPACITE_MAX = 15;

export const pourcentageCharge = (ticketsEnCours: number): number => {
  return Math.min(100, Math.round((ticketsEnCours / CAPACITE_MAX) * 100));
};

export const estSurcharge = (ticketsEnCours: number): boolean => {
  return ticketsEnCours >= CAPACITE_MAX;
};