import type { ChargeTechnicien } from '../../types/stats';
import { nomComplet } from '../../utils/format';

interface WorkloadListProps {
  techniciens: ChargeTechnicien[];
}

export default function WorkloadList({ techniciens }: WorkloadListProps) {
  const max = Math.max(1, ...techniciens.map((t) => t.tickets_en_cours));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Charge par technicien</h2>
      {techniciens.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Aucun technicien actif.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {techniciens.map((t) => (
            <li key={t.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{nomComplet(t.prenom, t.nom)}</span>
                <span className="font-semibold text-slate-900">{t.tickets_en_cours}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-blue-700"
                  style={{ width: `${(t.tickets_en_cours / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}