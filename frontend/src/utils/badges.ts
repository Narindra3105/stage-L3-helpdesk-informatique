import type { CouleurBadge } from '../components/common/Badge';

export const couleurPriorite = (nom: string): CouleurBadge => {
  switch (nom.toLowerCase()) {
    case 'critique':
    case 'haute':
      return 'rouge';
    case 'moyenne':
      return 'orange';
    case 'basse':
      return 'vert';
    default:
      return 'gris';
  }
};

export const couleurStatut = (nom: string): CouleurBadge => {
  switch (nom.toLowerCase()) {
    case 'nouveau':
      return 'bleu';
    case 'en cours':
      return 'orange';
    case 'en attente':
      return 'gris';
    case 'résolu':
    case 'clos':
    case 'fermé':
      return 'vert';
    default:
      return 'gris';
  }
};