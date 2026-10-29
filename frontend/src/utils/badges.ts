import type { CouleurBadge } from '../components/common/Badge';

export const couleurPriorite = (nom: string): CouleurBadge => {
  switch (nom.toLowerCase()) {
    case 'urgente':
    case 'critique':
      return 'rouge';
    case 'haute':
      return 'orange';
    case 'moyenne':
      return 'bleu';
    case 'basse':
      return 'vert';
    default:
      return 'gris';
  }
};

export const couleurStatut = (nom: string): CouleurBadge => {
  switch (nom.toLowerCase()) {
    case 'ouvert':
    case 'nouveau':
      return 'bleu';
    case 'en cours':
      return 'orange';
    case 'résolu':
      return 'vert';
    case 'en attente':
    case 'clos':
      return 'gris';
    default:
      return 'gris';
  }
};