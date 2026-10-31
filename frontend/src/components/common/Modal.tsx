import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

type LargeurModal = 'md' | 'lg';

const largeurs: Record<LargeurModal, string> = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

interface ModalProps {
  titre: string;
  onFermer: () => void;
  largeur?: LargeurModal;
  children: ReactNode;
}

export default function Modal({ titre, onFermer, largeur = 'md', children }: ModalProps) {
  useEffect(() => {
    const surTouche = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onFermer();
      }
    };

    document.addEventListener('keydown', surTouche);
    return () => document.removeEventListener('keydown', surTouche);
  }, [onFermer]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titre}
        className={`max-h-full w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ${largeurs[largeur]}`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{titre}</h2>
          <button
            onClick={onFermer}
            title="Fermer"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}