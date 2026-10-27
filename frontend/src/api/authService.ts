import type { LoginPayload, LoginResponse } from "../types/auth";
import type { Utilisateur } from "../types/user";
import axiosClient from "./axiosClient";

export const login = async (payload:LoginPayload): Promise<LoginResponse> =>{
    const {data} = await axiosClient.post<LoginResponse>('/auth/login', payload);
    return data;
};
export const getMe = async (): Promise<Utilisateur> =>{
    const {data} = await axiosClient.get<{utilisateur:Utilisateur}>('/auth/me');
    return data.utilisateur;
};