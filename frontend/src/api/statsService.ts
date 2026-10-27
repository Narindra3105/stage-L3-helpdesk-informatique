import axiosClient from './axiosClient';
import type { DashboardStats } from '../types/stats';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await axiosClient.get<DashboardStats>('/stats/dashboard');
  return data;
};