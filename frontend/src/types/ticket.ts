export interface Ticket {
  id: number;
  numero: string;
  sujet: string;
  description: string | null;
  demandeur_id: number;
  demandeur_nom: string;
  demandeur_prenom: string | null;
  technicien_id: number | null;
  technicien_nom: string | null;
  equipe_id: number;
  equipe_nom: string;
  priorite_id: number;
  priorite_nom: string;
  priorite_couleur: string;
  categorie_id: number | null;
  categorie_nom: string | null;
  statut_id: number;
  statut_nom: string;
  est_final: number;
  sla_id: number | null;
  date_creation: string;
  date_limite_reponse: string | null;
  date_limite_resolution: string | null;
  date_premiere_reponse: string | null;
  date_resolution: string | null;
  reouvert: number;
  nb_reouvertures: number;
}

export interface NouveauTicketPayload {
  sujet: string;
  description?: string;
  equipe_id: number;
  priorite_id: number;
  categorie_id: number;
}