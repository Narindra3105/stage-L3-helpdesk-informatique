import { useEffect, useState } from 'react';
import { getEquipes } from '../api/referentielService';
import { getStatsTechniciens } from '../api/statsService';
import Modal from '../components/common/Modal';
import TechnicienCard from '../components/techniciens/TechnicienCard';
import TechnicienForm from '../components/techniciens/TechnicienForm';
import { messageErreur } from '../utils/erreurs';
import type { Equipe } from '../types/referentiel';
import type { StatTechnicien } from '../types/stats';

type EtatModal = { mode: 'creation' } | { mode: 'edition'; technicien: StatTechnicien } | null;

export default function TechniciensPage() {
  const [techniciens, setTechniciens] = useState<StatTechnicien[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [modal, setModal] = useState<EtatModal>(null);
  const [rechargement, setRechargement] = useState<number>(0);

  useEffect(() => {
    const charger = async () => {
      try {
        const [listeTechniciens, listeEquipes] = await Promise.all([
          getStatsTechniciens(),
          getEquipes(),
        ]);
        setTechniciens(listeTechniciens);
        setEquipes(listeEquipes);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger les techniciens.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, [rechargement]);

  const fermer = () => setModal(null);

  const apresEnregistrement = () => {
    setModal(null);
    setRechargement((n) => n + 1);
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Techniciens</h1>
          <p className="mt-1 text-sm text-slate-500">Équipe du support et charge de travail</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'creation' })}
          className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Ajouter
        </button>
      </div>

      {loading && <p className="mt-8 text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {!loading && !erreur && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {techniciens.map((technicien) => (
            <TechnicienCard
              key={technicien.id}
              technicien={technicien}
              onModifier={(t) => setModal({ mode: 'edition', technicien: t })}
            />
          ))}

          <button
            onClick={() => setModal({ mode: 'creation' })}
            className="flex min-h-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-sm font-semibold text-blue-700 hover:bg-white"
          >
            + Ajouter un technicien
          </button>
        </div>
      )}

      {modal && (
        <Modal
          titre={modal.mode === 'creation' ? 'Ajouter un technicien' : 'Modifier le technicien'}
          onFermer={fermer}
        >
          <TechnicienForm
            technicien={modal.mode === 'edition' ? modal.technicien : undefined}
            equipes={equipes}
            onSucces={apresEnregistrement}
            onAnnuler={fermer}
          />
        </Modal>
      )}
    </div>
  );
}