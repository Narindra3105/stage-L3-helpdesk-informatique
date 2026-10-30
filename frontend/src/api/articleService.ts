import axiosClient from './axiosClient';
import type { Article, ArticleDetail, ArticlePayload } from '../types/article';

export const getArticles = async (): Promise<Article[]> => {
  const { data } = await axiosClient.get<Article[]>('/articles');
  return data;
};

export const getArticle = async (id: number): Promise<ArticleDetail> => {
  const { data } = await axiosClient.get<ArticleDetail>(`/articles/${id}`);
  return data;
};

export const creerArticle = async (payload: ArticlePayload): Promise<ArticleDetail> => {
  const { data } = await axiosClient.post<ArticleDetail>('/articles', payload);
  return data;
};

export const modifierArticle = async (
  id: number,
  payload: ArticlePayload
): Promise<ArticleDetail> => {
  const { data } = await axiosClient.put<ArticleDetail>(`/articles/${id}`, payload);
  return data;
};

export const supprimerArticle = async (id: number): Promise<void> => {
  await axiosClient.delete(`/articles/${id}`);
};