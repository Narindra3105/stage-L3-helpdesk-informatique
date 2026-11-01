import axiosClient from './axiosClient';
import type { LoginPayload, LoginResponse, RegisterPayload } from '../types/auth';
import type { Utilisateur } from '../types/user';

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await axiosClient.post<LoginResponse>('/auth/login', payload);
  return data;
};

export const inscrire = async (payload: RegisterPayload): Promise<Utilisateur> => {
  const { data } = await axiosClient.post<Utilisateur>('/auth/register', payload);
  return data;
};

export const getMe = async (): Promise<Utilisateur> => {
  const { data } = await axiosClient.get<{ utilisateur: Utilisateur }>('/auth/me');
  return data.utilisateur;
};