import Badge from '../common/Badge';
import { couleurPriorite, couleurStatut } from '../../utils/badges';
import { nomComplet } from '../../utils/format';
import type { DernierTicket } from '../../types/stats';

interface LatestTicketsTableProps {
  tickets: DernierTicket[];
}

export default function LatestTicketsTable({ tickets }: LatestTicketsTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Derniers tickets</h2>
      {tickets.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Aucun ticket pour le moment.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="pb-2 pr-4 font-medium">N°</th>
                <th className="pb-2 pr-4 font-medium">Sujet</th>
                <th className="pb-2 pr-4 font-medium">Priorité</th>
                <th className="pb-2 pr-4 font-medium">Technicien</th>
                <th className="pb-2 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4 text-slate-500">{t.numero}</td>
                  <td className="py-3 pr-4 font-medium text-slate-900">{t.sujet}</td>
                  <td className="py-3 pr-4">
                    <Badge couleur={couleurPriorite(t.priorite_nom)}>{t.priorite_nom}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">
                    {t.technicien_nom
                      ? nomComplet(t.technicien_prenom, t.technicien_nom)
                      : 'Non assigné'}
                  </td>
                  <td className="py-3">
                    <Badge couleur={couleurStatut(t.statut_nom)}>{t.statut_nom}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}