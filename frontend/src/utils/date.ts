import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDateHeure = (iso: string | null): string => {
  if (!iso) {
    return '—';
  }
  return format(new Date(iso), 'dd/MM/yyyy HH:mm');
};

export const formatDate = (iso: string | null): string => {
  if (!iso) {
    return '—';
  }
  return format(new Date(iso), 'dd/MM/yyyy');
};

export const formatDepuis = (iso: string): string => {
  const texte = formatDistanceToNow(new Date(iso), { addSuffix: true, locale: fr });
  return texte.charAt(0).toUpperCase() + texte.slice(1);
};