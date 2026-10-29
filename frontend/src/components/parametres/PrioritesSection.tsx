import { useEffect, useState } from 'react';
import { getPriorites, supprimerPriorite } from '../../api/referentielService';
import Modal from '../common/Modal';
import PriorityBadge from '../tickets/PriorityBadge';
import PrioriteForm from './PrioriteForm';
import { messageErreur } from '../../utils/erreurs';
import type { Priorite } from '../../types/referentiel';

type EtatModal = { mode: 'creation' } | { mode: 'edition'; priorite: Priorite } | null;

const COULEUR_PAR_DEFAUT = '#64748B';

interface PrioritesSectionProps {
  onModification: () => void;
}

export default function PrioritesSection({ onModification }: PrioritesSectionProps) {
  const [priorites, setPriorites] = useState<Priorite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurAction, setErreurAction] = useState<string | null>(null);
  const [modal, setModal] = useState<EtatModal>(null);
  const [rechargement, setRechargement] = useState<number>(0);

  useEffect(() => {
    const charger = async () => {
      try {
        const liste = await getPriorites();
        setPriorites(liste);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger les priorités.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, [rechargement]);

  const triees = [...priorites].sort(
    (a, b) => a.niveau_ordre - b.niveau_ordre || a.nom.localeCompare(b.nom)
  );

  const niveauSuggere = Math.min(255, Math.max(0, ...priorites.map((p) => p.niveau_ordre)) + 1);

  const fermer = () => setModal(null);

  const apresModification = () => {
    setRechargement((n) => n + 1);
    onModification();
  };

  const apresEnregistrement = () => {
    setModal(null);
    apresModification();
  };

  const supprimer = async (priorite: Priorite) => {
    if (!window.confirm(`Supprimer la priorité « ${priorite.nom} » ?`)) {
      return;
    }

    setErreurAction(null);
    try {
      await supprimerPriorite(priorite.id);
      apresModification();
    } catch (e) {
      setErreurAction(messageErreur(e, 'Impossible de supprimer la priorité.'));
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Priorités</h2>
          <p className="mt-1 text-sm text-slate-500">
            Une priorité utilisée par des tickets ou des règles SLA ne peut pas être supprimée.
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'creation' })}
          className="shrink-0 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Ajouter une priorité
        </button>
      </div>

      {loading && <p className="mt-4 text-sm text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {erreurAction && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreurAction}</p>
      )}

      {!loading && !erreur && triees.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">Aucune priorité pour le moment.</p>
      )}

      {triees.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="pb-2 pr-4 font-medium">Priorité</th>
                <th className="pb-2 pr-4 font-medium">Niveau</th>
                <th className="pb-2 pr-4 font-medium">Couleur</th>
                <th className="pb-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {triees.map((priorite) => {
                const couleur = priorite.couleur ?? COULEUR_PAR_DEFAUT;
                return (
                  <tr key={priorite.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4">
                      <PriorityBadge nom={priorite.nom} couleur={couleur} />
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{priorite.niveau_ordre}</td>
                    <td className="py-3 pr-4 text-slate-600">
                      <span
                        className="mr-2 inline-block h-4 w-4 rounded-full border border-slate-200 align-middle"
                        style={{ backgroundColor: couleur }}
                      />
                      {couleur}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setModal({ mode: 'edition', priorite })}
                        className="mr-3 text-xs font-medium text-blue-700 hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => supprimer(priorite)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          titre={modal.mode === 'creation' ? 'Ajouter une priorité' : 'Modifier la priorité'}
          onFermer={fermer}
        >
          <PrioriteForm
            priorite={modal.mode === 'edition' ? modal.priorite : undefined}
            niveauSuggere={niveauSuggere}
            onSucces={apresEnregistrement}
            onAnnuler={fermer}
          />
        </Modal>
      )}
    </div>
  );
}