import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import PriorityBadge from '../tickets/PriorityBadge';
import { couleurStatut } from '../../utils/badges';
import { estEnRetard, texteSlaCourt } from '../../utils/sla';
import type { Ticket } from '../../types/ticket';

interface WatchTableProps {
  tickets: Ticket[];
}

export default function WatchTable({ tickets }: WatchTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
            <th className="pb-2 pr-4 font-medium">N°</th>
            <th className="pb-2 pr-4 font-medium">Sujet</th>
            <th className="pb-2 pr-4 font-medium">Priorité</th>
            <th className="pb-2 pr-4 font-medium">Statut</th>
            <th className="pb-2 font-medium">Délai SLA</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            const enRetard = estEnRetard(ticket);
            return (
              <tr key={ticket.id} className="border-b border-slate-100 last:border-0">
                <td className="py-3 pr-4 text-slate-500">{ticket.numero}</td>
                <td className="py-3 pr-4">
                  <Link
                    to={`/tickets/${ticket.id}`}
                    className="font-medium text-slate-900 hover:text-blue-700 hover:underline"
                  >
                    {ticket.sujet}
                  </Link>
                </td>
                <td className="py-3 pr-4">
                  <PriorityBadge nom={ticket.priorite_nom} couleur={ticket.priorite_couleur} />
                </td>
                <td className="py-3 pr-4">
                  <Badge couleur={couleurStatut(ticket.statut_nom)}>{ticket.statut_nom}</Badge>
                </td>
                <td
                  className={`whitespace-nowrap py-3 ${
                    enRetard ? 'font-medium text-red-600' : 'text-slate-600'
                  }`}
                >
                  {ticket.date_limite_resolution ? texteSlaCourt(ticket) : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}