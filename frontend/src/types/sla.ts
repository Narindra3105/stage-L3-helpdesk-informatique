export interface Sla {
  id: number;
  nom: string;
  priorite_id: number;
  equipe_id: number | null;
  delai_premiere_reponse_min: number;
  delai_resolution_min: number;
}

export interface SlaPayload {
  nom: string;
  priorite_id: number;
  equipe_id: number | null;
  delai_premiere_reponse_min: number;
  delai_resolution_min: number;
}