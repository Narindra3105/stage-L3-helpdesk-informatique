export const formatDuree = (minutes: number | null): string => {
  if (minutes === null) {
    return '—';
  }
  const heures = Math.floor(minutes / 60);
  const reste = minutes % 60;
  if (heures === 0) {
    return `${reste} min`;
  }
  if (reste === 0) {
    return `${heures} h`;
  }
  return `${heures} h ${String(reste).padStart(2, '0')}`;
};

export const nomComplet = (prenom: string | null, nom: string): string => {
  return [prenom, nom].filter(Boolean).join(' ');
};
export const initiales = (prenom: string | null, nom: string): string => {
  const lettres = prenom ? prenom.charAt(0) + nom.charAt(0) : nom.slice(0, 2);
  return lettres.toUpperCase();
};