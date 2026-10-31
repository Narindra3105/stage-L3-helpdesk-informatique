import { Link } from 'react-router-dom';
import PriorityBadge from './PriorityBadge';
import { formatDepuis } from '../../utils/date';
import { nomComplet } from '../../utils/format';
import type { Ticket } from '../../types/ticket';

interface QueueTableProps {
  tickets: Ticket[];
  enCoursId: number | null;
  onPrendre: (ticket: Ticket) => void;
}

export default function QueueTable({ tickets, enCoursId, onPrendre }: QueueTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
            <th className="pb-2 pr-4 font-medium">N°</th>
            <th className="pb-2 pr-4 font-medium">Sujet</th>
            <th className="pb-2 pr-4 font-medium">Priorité</th>
            <th className="pb-2 pr-4 font-medium">Catégorie</th>
            <th className="pb-2 pr-4 font-medium">Demandeur</th>
            <th className="pb-2 pr-4 font-medium">Reçu</th>
            <th className="pb-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
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
              <td className="py-3 pr-4 text-slate-600">{ticket.categorie_nom ?? '—'}</td>
              <td className="py-3 pr-4 text-slate-600">
                {nomComplet(ticket.demandeur_prenom, ticket.demandeur_nom)}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-slate-500">
                {formatDepuis(ticket.date_creation)}
              </td>
              <td className="py-3 text-right">
                <button
                  onClick={() => onPrendre(ticket)}
                  disabled={enCoursId !== null}
                  className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                >
                  {enCoursId === ticket.id ? '...' : 'Prendre'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}