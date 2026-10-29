import type { Ticket } from '../types/ticket';
import type { Utilisateur } from '../types/user';

export const peutChangerStatut = (user: Utilisateur | null, ticket: Ticket): boolean => {
  if (!user) {
    return false;
  }
  if (user.role === 'admin') {
    return true;
  }
  return user.role === 'technicien' && ticket.technicien_id === user.id;
};