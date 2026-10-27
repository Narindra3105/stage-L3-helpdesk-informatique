export interface ResumeStats {
  tickets_ouverts: number;
  sla_depasse: number;
  resolus_aujourdhui: number;
  temps_moyen_minutes: number | null;
  respect_sla: number | null;
}

export interface ChargeTechnicien {
  id: number;
  nom: string;
  prenom: string | null;
  tickets_en_cours: number;
}

export interface DernierTicket {
  id: number;
  numero: string;
  sujet: string;
  priorite_nom: string;
  statut_nom: string;
  technicien_nom: string | null;
  technicien_prenom: string | null;
}

export interface DashboardStats {
  resume: ResumeStats;
  charge_techniciens: ChargeTechnicien[];
  derniers_tickets: DernierTicket[];
}