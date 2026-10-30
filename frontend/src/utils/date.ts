import { format } from 'date-fns';

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