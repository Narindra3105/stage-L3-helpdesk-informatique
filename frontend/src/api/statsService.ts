import axiosClient from './axiosClient';
import type { DashboardStats, StatTechnicien } from '../types/stats';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await axiosClient.get<DashboardStats>('/stats/dashboard');
  return data;
};

export const getStatsTechniciens = async (): Promise<StatTechnicien[]> => {
  const { data } = await axiosClient.get<StatTechnicien[]>('/stats/techniciens');
  return data;
};