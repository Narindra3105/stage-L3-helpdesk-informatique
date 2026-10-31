import { classeChamp } from '../../utils/styles';
import type { Categorie, Priorite } from '../../types/referentiel';

interface OptionTechnicien {
  id: number;
  nom: string;
}

interface TicketFiltersProps {
  recherche: string;
  onRecherche: (valeur: string) => void;
  placeholderRecherche?: string;
  priorite: string;
  onPriorite: (valeur: string) => void;
  priorites: Priorite[];
  technicien?: string;
  onTechnicien?: (valeur: string) => void;
  techniciens?: OptionTechnicien[];
  categorie?: string;
  onCategorie?: (valeur: string) => void;
  categories?: Categorie[];
}

export default function TicketFilters({
  recherche,
  onRecherche,
  placeholderRecherche = 'Rechercher un ticket',
  priorite,
  onPriorite,
  priorites,
  technicien,
  onTechnicien,
  techniciens,
  categorie,
  onCategorie,
  categories,
}: TicketFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="text"
        value={recherche}
        onChange={(e) => onRecherche(e.target.value)}
        placeholder={placeholderRecherche}
        aria-label={placeholderRecherche}
        className={`${classeChamp} mt-0 w-full sm:w-72`}
      />

      <select
        value={priorite}
        onChange={(e) => onPriorite(e.target.value)}
        aria-label="Filtrer par priorité"
        className={`${classeChamp} mt-0 w-auto`}
      >
        <option value="">Toutes les priorités</option>
        {priorites.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nom}
          </option>
        ))}
      </select>

      {categories && onCategorie && categorie !== undefined && (
        <select
          value={categorie}
          onChange={(e) => onCategorie(e.target.value)}
          aria-label="Filtrer par catégorie"
          className={`${classeChamp} mt-0 w-auto`}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
      )}

      {techniciens && onTechnicien && technicien !== undefined && (
        <select
          value={technicien}
          onChange={(e) => onTechnicien(e.target.value)}
          aria-label="Filtrer par technicien"
          className={`${classeChamp} mt-0 w-auto`}
        >
          <option value="">Tous les techniciens</option>
          <option value="aucun">Non assigné</option>
          {techniciens.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nom}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}