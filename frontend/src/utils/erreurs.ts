import { isAxiosError } from 'axios';

export interface ErreurChamp {
  champ: string;
  message: string;
}

export const messageErreur = (e: unknown, defaut: string): string => {
  if (isAxiosError(e)) {
    const message = e.response?.data?.message;
    if (typeof message === 'string') {
      return message;
    }
  }
  return defaut;
};

export const erreursChamps = (e: unknown): ErreurChamp[] => {
  if (isAxiosError(e)) {
    const erreurs = e.response?.data?.errors;
    if (Array.isArray(erreurs)) {
      return erreurs.filter(
        (x): x is ErreurChamp => typeof x?.champ === 'string' && typeof x?.message === 'string'
      );
    }
  }
  return [];
};

export const codeStatut = (e: unknown): number | null => {
  if (isAxiosError(e) && e.response) {
    return e.response.status;
  }
  return null;
};