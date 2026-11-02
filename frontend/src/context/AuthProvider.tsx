import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginRequest } from '../api/authService';
import { getProfil } from '../api/profilService';
import type { LoginPayload } from '../types/auth';
import type { Utilisateur } from '../types/user';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(() => localStorage.getItem('token') !== null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      return;
    }

    const restaurerSession = async () => {
      try {
        const utilisateur = await getProfil();
        setUser(utilisateur);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restaurerSession();
  }, []);

  const login = async (payload: LoginPayload) => {
    const reponse = await loginRequest(payload);
    localStorage.setItem('token', reponse.token);
    setToken(reponse.token);
    setUser(reponse.utilisateur);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const mettreAJourUtilisateur = (utilisateur: Utilisateur) => {
    setUser(utilisateur);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, mettreAJourUtilisateur }}>
      {children}
    </AuthContext.Provider>
  );
}