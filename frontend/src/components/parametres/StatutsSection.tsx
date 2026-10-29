import { useEffect, useState } from 'react';
import { getStatuts, supprimerStatut } from '../../api/referentielService';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import StatutForm from './StatutForm';
import { couleurStatut } from '../../utils/badges';
import { messageErreur } from '../../utils/erreurs';
import type { Statut } from '../../types/referentiel';

type EtatModal = { mode: 'creation' } | { mode: 'edition'; statut: Statut } | null;

export default function StatutsSection() {
  const [statuts, setStatuts] = useState<Statut[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurAction, setErreurAction] = useState<string | null>(null);
  const [modal, setModal] = useState<EtatModal>(null);
  const [rechargement, setRechargement] = useState<number>(0);

  useEffect(() => {
    const charger = async () => {
      try {
        const liste = await getStatuts();
        setStatuts(liste);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger les statuts.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, [rechargement]);

  const tries = [...statuts].sort((a, b) => a.ordre - b.ordre || a.nom.localeCompare(b.nom));
  const idInitial = tries.length > 0 ? tries[0].id : null;

  const ordreSuggere = Math.min(255, Math.max(0, ...statuts.map((s) => s.ordre)) + 1);

  const fermer = () => setModal(null);

  const apresEnregistrement = () => {
    setModal(null);
    setRechargement((n) => n + 1);
  };

  const supprimer = async (statut: Statut) => {
    if (!window.confirm(`Supprimer le statut « ${statut.nom} » ?`)) {
      return;
    }

    setErreurAction(null);
    try {
      await supprimerStatut(statut.id);
      setRechargement((n) => n + 1);
    } catch (e) {
      setErreurAction(messageErreur(e, 'Impossible de supprimer le statut.'));
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Statuts</h2>
          <p className="mt-1 text-sm text-slate-500">
            Chaque statut est une colonne du tableau des tickets. Un statut utilisé par des tickets
            ne peut pas être supprimé.
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'creation' })}
          className="shrink-0 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Ajouter un statut
        </button>
      </div>

      {loading && <p className="mt-4 text-sm text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {erreurAction && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreurAction}</p>
      )}

      {!loading && !erreur && tries.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">Aucun statut pour le moment.</p>
      )}

      {tries.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="pb-2 pr-4 font-medium">Ordre</th>
                <th className="pb-2 pr-4 font-medium">Statut</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {tries.map((statut) => (
                <tr key={statut.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4 text-slate-700">{statut.ordre}</td>
                  <td className="py-3 pr-4">
                    <Badge couleur={couleurStatut(statut.nom)}>{statut.nom}</Badge>
                    {statut.id === idInitial && (
                      <span className="ml-2 text-xs text-slate-400">statut initial</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {statut.est_final ? (
                      <Badge couleur="vert">Final</Badge>
                    ) : (
                      <span className="text-slate-500">Non final</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setModal({ mode: 'edition', statut })}
                      className="mr-3 text-xs font-medium text-blue-700 hover:underline"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => supprimer(statut)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          titre={modal.mode === 'creation' ? 'Ajouter un statut' : 'Modifier le statut'}
          onFermer={fermer}
        >
          <StatutForm
            statut={modal.mode === 'edition' ? modal.statut : undefined}
            ordreSuggere={ordreSuggere}
            onSucces={apresEnregistrement}
            onAnnuler={fermer}
          />
        </Modal>
      )}
    </div>
  );
}