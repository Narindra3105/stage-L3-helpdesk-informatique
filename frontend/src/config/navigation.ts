import type { Role } from '../types/user';

export interface LienMenu {
  to: string;
  label: string;
  end?: boolean;
}

export const menusParRole: Record<Role, LienMenu[]> = {
  admin: [
    { to: '/', label: 'Tableau de bord', end: true },
    { to: '/tickets', label: 'Tickets' },
    { to: '/base-connaissances', label: 'Base de connaissances' },
    { to: '/techniciens', label: 'Techniciens' },
    { to: '/utilisateurs', label: 'Utilisateurs' },
    { to: '/rapports-sla', label: 'Rapports SLA' },
    { to: '/parametres', label: 'Paramètres' },
    { to: '/profil', label: 'Mon profil' },
  ],
  technicien: [
    { to: '/', label: 'Tableau de bord', end: true },
    { to: '/mes-tickets', label: 'Mes tickets' },
    { to: '/file-attente', label: "File d'attente" },
    { to: '/base-connaissances', label: 'Base de connaissances' },
    { to: '/mon-activite', label: 'Mon activité' },
    { to: '/profil', label: 'Mon profil' },
  ],
  demandeur: [
    { to: '/', label: 'Accueil', end: true },
    { to: '/tickets', label: 'Mes tickets' },
    { to: '/base-connaissances', label: 'Aide' },
    { to: '/profil', label: 'Mon profil' },
  ],
};

export const retourListeTickets: Record<Role, { to: string; label: string }> = {
  admin: { to: '/tickets', label: 'Retour à la liste des tickets' },
  technicien: { to: '/mes-tickets', label: 'Retour à mes tickets' },
  demandeur: { to: '/tickets', label: 'Retour à mes tickets' },
};