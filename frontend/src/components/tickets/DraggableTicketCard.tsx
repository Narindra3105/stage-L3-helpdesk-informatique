import { useDraggable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
import TicketCard from './TicketCard';
import type { VarianteCarte } from './TicketCard';
import type { Ticket } from '../../types/ticket';

interface DraggableTicketCardProps {
  ticket: Ticket;
  peutDeplacer: boolean;
  variante: VarianteCarte;
}

export default function DraggableTicketCard({
  ticket,
  peutDeplacer,
  variante,
}: DraggableTicketCardProps) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: ticket.id,
    disabled: !peutDeplacer,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className={`${peutDeplacer ? 'cursor-grab' : 'cursor-pointer'} ${isDragging ? 'opacity-40' : ''}`}
    >
      <TicketCard ticket={ticket} variante={variante} />
    </div>
  );
}