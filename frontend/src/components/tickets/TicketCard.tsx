import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import PriorityBadge from './PriorityBadge';
import { nomComplet } from '../../utils/format';
import { estEnRetard, texteSlaCourt } from '../../utils/sla';
import type { Ticket } from '../../types/ticket';

export type VarianteCarte = 'admin' | 'technicien';

interface TicketCardProps {
  ticket: Ticket;
  variante?: VarianteCarte;
}

export default function TicketCard({ ticket, variante = 'admin' }: TicketCardProps) {
  const enRetard = estEnRetard(ticket);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{ticket.sujet}</p>

      <div className="mt-2 flex items-center justify-between">
        <PriorityBadge nom={ticket.priorite_nom} couleur={ticket.priorite_couleur} />
        <span className="text-xs text-slate-400">{ticket.numero}</span>
      </div>

      {variante === 'technicien' ? (
        <p className={`mt-3 text-xs ${enRetard ? 'font-medium text-red-600' : 'text-slate-500'}`}>
          {nomComplet(ticket.demandeur_prenom, ticket.demandeur_nom)} · {texteSlaCourt(ticket)}
        </p>
      ) : (
        <>
          {enRetard && (
            <div className="mt-2">
              <Badge couleur="rouge">SLA dépassé</Badge>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {ticket.technicien_nom ?? 'Non assigné'}
            </span>
            <Avatar texte={ticket.technicien_nom ? ticket.technicien_nom.charAt(0) : '?'} />
          </div>
        </>
      )}
    </div>
  );
}