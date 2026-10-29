import type { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { CouleurBadge } from '../common/Badge';
import { couleurStatut } from '../../utils/badges';
import type { Statut } from '../../types/referentiel';

const fonds: Record<CouleurBadge, string> = {
  bleu: 'bg-blue-50',
  orange: 'bg-amber-50',
  vert: 'bg-green-50',
  rouge: 'bg-red-50',
  gris: 'bg-slate-100',
};

const titres: Record<CouleurBadge, string> = {
  bleu: 'text-blue-800',
  orange: 'text-amber-800',
  vert: 'text-green-800',
  rouge: 'text-red-800',
  gris: 'text-slate-600',
};

interface TicketColumnProps {
  statut: Statut;
  nombre: number;
  children: ReactNode;
}

export default function TicketColumn({ statut, nombre, children }: TicketColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `statut-${statut.id}`,
    data: { statutId: statut.id },
  });
  const couleur = couleurStatut(statut.nom);

  return (
    <div
      ref={setNodeRef}
      className={`w-72 shrink-0 rounded-2xl p-3 ${fonds[couleur]} ${
        isOver ? 'ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="flex items-center justify-between px-1 pb-3">
        <h2 className={`text-sm font-semibold ${titres[couleur]}`}>{statut.nom}</h2>
        <span className={`text-sm font-semibold ${titres[couleur]}`}>{nombre}</span>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}