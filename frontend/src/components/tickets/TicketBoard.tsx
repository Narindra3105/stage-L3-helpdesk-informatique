import { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import TicketColumn from './TicketColumn';
import TicketCard from './TicketCard';
import type { VarianteCarte } from './TicketCard';
import DraggableTicketCard from './DraggableTicketCard';
import type { Statut } from '../../types/referentiel';
import type { Ticket } from '../../types/ticket';

interface TicketBoardProps {
  statuts: Statut[];
  tickets: Ticket[];
  peutDeplacer: (ticket: Ticket) => boolean;
  onDeplacer: (ticketId: number, statutId: number) => void;
  variante?: VarianteCarte;
}

export default function TicketBoard({
  statuts,
  tickets,
  peutDeplacer,
  onDeplacer,
  variante = 'admin',
}: TicketBoardProps) {
  const [actif, setActif] = useState<Ticket | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const auDebut = (event: DragStartEvent) => {
    const ticket = tickets.find((t) => t.id === Number(event.active.id));
    setActif(ticket ?? null);
  };

  const alaFin = (event: DragEndEvent) => {
    setActif(null);
    const statutId = event.over?.data.current?.statutId as number | undefined;
    if (statutId !== undefined) {
      onDeplacer(Number(event.active.id), statutId);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={auDebut}
      onDragEnd={alaFin}
      onDragCancel={() => setActif(null)}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuts.map((statut) => {
          const ticketsColonne = tickets.filter((t) => t.statut_id === statut.id);
          return (
            <TicketColumn key={statut.id} statut={statut} nombre={ticketsColonne.length}>
              {ticketsColonne.map((ticket) => (
                <DraggableTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  peutDeplacer={peutDeplacer(ticket)}
                  variante={variante}
                />
              ))}
            </TicketColumn>
          );
        })}
      </div>

      <DragOverlay>{actif ? <TicketCard ticket={actif} variante={variante} /> : null}</DragOverlay>
    </DndContext>
  );
}