import type { Priorite } from '../../types/referentiel';

interface TechnicienOption {
  id: number;
  nom: string;
}

interface TicketFiltersProps {
  recherche: string;
  onRecherche: (valeur: string) => void;
  priorite: string;
  onPriorite: (valeur: string) => void;
  technicien: string;
  onTechnicien: (valeur: string) => void;
  priorites: Priorite[];
  techniciens: TechnicienOption[];
}

const classeChamp =
  'rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20';

export default function TicketFilters({
  recherche,
  onRecherche,
  priorite,
  onPriorite,
  technicien,
  onTechnicien,
  priorites,
  techniciens,
}: TicketFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="text"
        value={recherche}
        onChange={(e) => onRecherche(e.target.value)}
        placeholder="Rechercher un ticket"
        className={`${classeChamp} w-full sm:w-72`}
      />

      <select value={priorite} onChange={(e) => onPriorite(e.target.value)} className={classeChamp}>
        <option value="">Toutes les priorités</option>
        {priorites.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nom}
          </option>
        ))}
      </select>

      <select
        value={technicien}
        onChange={(e) => onTechnicien(e.target.value)}
        className={classeChamp}
      >
        <option value="">Tous les techniciens</option>
        <option value="aucun">Non assigné</option>
        {techniciens.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nom}
          </option>
        ))}
      </select>
    </div>
  );
}