import { useEffect, useState } from 'react';
import { getEquipes, getPriorites } from '../../api/referentielService';
import { getSlas, supprimerSla } from '../../api/slaService';
import Modal from '../common/Modal';
import PriorityBadge from '../tickets/PriorityBadge';
import SlaForm from './SlaForm';
import { formatDelai } from '../../utils/format';
import { messageErreur } from '../../utils/erreurs';
import type { Equipe, Priorite } from '../../types/referentiel';
import type { Sla } from '../../types/sla';

type EtatModal = { mode: 'creation' } | { mode: 'edition'; sla: Sla } | null;

const COULEUR_PAR_DEFAUT = '#64748B';

export default function SlaSection() {
  const [slas, setSlas] = useState<Sla[]>([]);
  const [priorites, setPriorites] = useState<Priorite[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurAction, setErreurAction] = useState<string | null>(null);
  const [modal, setModal] = useState<EtatModal>(null);
  const [rechargement, setRechargement] = useState<number>(0);

  useEffect(() => {
    const charger = async () => {
      try {
        const [listeSlas, listePriorites, listeEquipes] = await Promise.all([
          getSlas(),
          getPriorites(),
          getEquipes(),
        ]);
        setSlas(listeSlas);
        setPriorites(listePriorites);
        setEquipes(listeEquipes);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger les règles SLA.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, [rechargement]);

  const prioriteParId = new Map(priorites.map((p) => [p.id, p]));
  const equipeParId = new Map(equipes.map((e) => [e.id, e.nom]));

  const slasTries = [...slas].sort((a, b) => {
    const niveauA = prioriteParId.get(a.priorite_id)?.niveau_ordre ?? 99;
    const niveauB = prioriteParId.get(b.priorite_id)?.niveau_ordre ?? 99;
    return niveauA - niveauB || a.nom.localeCompare(b.nom);
  });

  const fermer = () => setModal(null);

  const apresEnregistrement = () => {
    setModal(null);
    setRechargement((n) => n + 1);
  };

  const supprimer = async (sla: Sla) => {
    const confirme = window.confirm(
      `Supprimer la règle « ${sla.nom} » ? Les tickets existants gardent leurs dates limites.`
    );
    if (!confirme) {
      return;
    }

    setErreurAction(null);
    try {
      await supprimerSla(sla.id);
      setRechargement((n) => n + 1);
    } catch (e) {
      setErreurAction(messageErreur(e, 'Impossible de supprimer la règle.'));
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Règles SLA par priorité</h2>
          <p className="mt-1 text-sm text-slate-500">
            Une priorité sans règle crée des tickets sans délai SLA.
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'creation' })}
          className="shrink-0 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Ajouter une règle
        </button>
      </div>

      {loading && <p className="mt-4 text-sm text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {erreurAction && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreurAction}</p>
      )}

      {!loading && !erreur && slasTries.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">Aucune règle SLA pour le moment.</p>
      )}

      {slasTries.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="pb-2 pr-4 font-medium">Priorité</th>
                <th className="pb-2 pr-4 font-medium">Équipe</th>
                <th className="pb-2 pr-4 font-medium">Prise en charge</th>
                <th className="pb-2 pr-4 font-medium">Résolution</th>
                <th className="pb-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {slasTries.map((sla) => {
                const priorite = prioriteParId.get(sla.priorite_id);
                return (
                  <tr key={sla.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4">
                      {priorite ? (
                        <PriorityBadge
                          nom={priorite.nom}
                          couleur={priorite.couleur ?? COULEUR_PAR_DEFAUT}
                        />
                      ) : (
                        <span className="text-slate-500">#{sla.priorite_id}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {sla.equipe_id !== null
                        ? (equipeParId.get(sla.equipe_id) ?? `#${sla.equipe_id}`)
                        : 'Toutes les équipes'}
                    </td>
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {formatDelai(sla.delai_premiere_reponse_min)}
                    </td>
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {formatDelai(sla.delai_resolution_min)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setModal({ mode: 'edition', sla })}
                        className="mr-3 text-xs font-medium text-blue-700 hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => supprimer(sla)}
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
          titre={modal.mode === 'creation' ? 'Ajouter une règle SLA' : 'Modifier la règle SLA'}
          onFermer={fermer}
        >
          <SlaForm
            sla={modal.mode === 'edition' ? modal.sla : undefined}
            priorites={priorites}
            equipes={equipes}
            onSucces={apresEnregistrement}
            onAnnuler={fermer}
          />
        </Modal>
      )}
    </div>
  );
}