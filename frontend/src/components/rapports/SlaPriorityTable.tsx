import PriorityBadge from '../tickets/PriorityBadge';
import type { SlaPriorite } from '../../types/stats';

const COULEUR_PAR_DEFAUT = '#64748B';

interface SlaPriorityTableProps {
  priorites: SlaPriorite[];
}

export default function SlaPriorityTable({ priorites }: SlaPriorityTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Par priorité</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <th className="pb-2 pr-4 font-medium">Priorité</th>
              <th className="pb-2 pr-4 font-medium">Tickets</th>
              <th className="pb-2 font-medium">Dans les délais</th>
            </tr>
          </thead>
          <tbody>
            {priorites.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="py-3 pr-4">
                  <PriorityBadge nom={p.nom} couleur={p.couleur ?? COULEUR_PAR_DEFAUT} />
                </td>
                <td className="py-3 pr-4 text-slate-700">{p.tickets}</td>
                <td className="py-3 font-medium text-slate-900">
                  {p.respect_sla === null ? '—' : `${p.respect_sla} %`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}