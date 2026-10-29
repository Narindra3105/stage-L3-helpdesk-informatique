import { useDraggable } from '@dnd-kit/core';
import TicketCard from './TicketCard';
import type { Ticket } from '../../types/ticket';

interface DraggableTicketCardProps {
  ticket: Ticket;
  peutDeplacer: boolean;
}

export default function DraggableTicketCard({ ticket, peutDeplacer }: DraggableTicketCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: ticket.id,
    disabled: !peutDeplacer,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${peutDeplacer ? 'cursor-grab' : ''} ${isDragging ? 'opacity-40' : ''}`}
    >
      <TicketCard ticket={ticket} />
    </div>
  );
}