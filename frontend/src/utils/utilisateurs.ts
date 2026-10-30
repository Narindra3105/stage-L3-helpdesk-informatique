import type { CouleurBadge } from '../components/common/Badge';
import type { Role, StatutUtilisateur } from '../types/user';

export const listeRoles: Role[] = ['admin', 'technicien', 'demandeur'];

export const listeStatutsUtilisateur: StatutUtilisateur[] = ['actif', 'absent', 'inactif'];

export const couleursRole: Record<Role, CouleurBadge> = {
  admin: 'bleu',
  technicien: 'orange',
  demandeur: 'gris',
};

export const infosStatutUtilisateur: Record<
  StatutUtilisateur,
  { libelle: string; couleur: CouleurBadge }
> = {
  actif: { libelle: 'Actif', couleur: 'vert' },
  absent: { libelle: 'Absent', couleur: 'orange' },
  inactif: { libelle: 'Inactif', couleur: 'gris' },
};