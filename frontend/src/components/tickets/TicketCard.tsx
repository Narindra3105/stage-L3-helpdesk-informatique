import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import PriorityBadge from './PriorityBadge';
import { estEnRetard } from '../../utils/sla';
import type { Ticket } from '../../types/ticket';

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{ticket.sujet}</p>

      <div className="mt-2 flex items-center justify-between">
        <PriorityBadge nom={ticket.priorite_nom} couleur={ticket.priorite_couleur} />
        <span className="text-xs text-slate-400">{ticket.numero}</span>
      </div>

      {estEnRetard(ticket) && (
        <div className="mt-2">
          <Badge couleur="rouge">SLA dépassé</Badge>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">{ticket.technicien_nom ?? 'Non assigné'}</span>
        <Avatar texte={ticket.technicien_nom ? ticket.technicien_nom.charAt(0) : '?'} />
      </div>
    </div>
  );
}