import { COULEUR_BARRE } from '../../utils/couleursGraphique';
import type { CategorieActivite } from '../../utils/activiteTechnicien';

interface CategoryBreakdownProps {
  categories: CategorieActivite[];
}

export default function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const maximum = Math.max(1, ...categories.map((c) => c.nombre));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Par catégorie</h2>

      {categories.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Aucun ticket résolu cette semaine.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {categories.map((categorie) => (
            <li key={categorie.nom}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{categorie.nom}</span>
                <span className="font-semibold text-slate-900">{categorie.nombre}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(categorie.nombre / maximum) * 100}%`,
                    backgroundColor: COULEUR_BARRE,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}