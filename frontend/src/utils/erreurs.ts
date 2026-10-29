import { isAxiosError } from 'axios';

export const messageErreur = (e: unknown, defaut: string): string => {
  if (isAxiosError(e)) {
    const message = e.response?.data?.message;
    if (typeof message === 'string') {
      return message;
    }
  }
  return defaut;
};