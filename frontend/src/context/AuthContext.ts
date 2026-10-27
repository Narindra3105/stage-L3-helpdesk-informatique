import { createContext } from "react";
import type { LoginPayload } from "../types/auth";
import type { Utilisateur } from "../types/user";

export interface AuthContextType {
    user:Utilisateur|null;
    token:string|null;
    loading:boolean;
    login:(payload:LoginPayload)=> Promise<void>;
    logout:()=> void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);