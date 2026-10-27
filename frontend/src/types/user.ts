export type Role = 'admin'|'technicien'|'demandeur';

export interface Utilisateur {
    id:number;
    nom:string;
    prenom:string|null;
    email:string;
    role:Role;
    equipe_id:number|null;
    derniere_activite:string|null;
    date_creation:string
}