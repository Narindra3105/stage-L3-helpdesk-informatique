import type { ReactNode } from 'react';

export type CouleurBadge = 'rouge' | 'orange' | 'vert' | 'bleu' | 'gris';

const styles: Record<CouleurBadge, string> = {
  rouge: 'bg-red-50 text-red-700',
  orange: 'bg-amber-50 text-amber-700',
  vert: 'bg-green-50 text-green-700',
  bleu: 'bg-blue-50 text-blue-700',
  gris: 'bg-slate-100 text-slate-600',
};

interface BadgeProps {
  couleur: CouleurBadge;
  children: ReactNode;
}

export default function Badge({ couleur, children }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[couleur]}`}
    >
      {children}
    </span>
  );
}