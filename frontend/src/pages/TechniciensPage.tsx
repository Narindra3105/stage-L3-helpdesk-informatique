import { useEffect, useState } from 'react';
import { getStatsTechniciens } from '../api/statsService';
import TechnicienCard from '../components/techniciens/TechnicienCard';
import { messageErreur } from '../utils/erreurs';
import type { StatTechnicien } from '../types/stats';

export default function TechniciensPage() {
  const [techniciens, setTechniciens] = useState<StatTechnicien[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const liste = await getStatsTechniciens();
        setTechniciens(liste);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger les techniciens.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Techniciens</h1>
      <p className="mt-1 text-sm text-slate-500">Équipe du support et charge de travail</p>

      {loading && <p className="mt-8 text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {!loading && !erreur && techniciens.length === 0 && (
        <p className="mt-8 text-sm text-slate-500">Aucun technicien enregistré.</p>
      )}

      {techniciens.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {techniciens.map((technicien) => (
            <TechnicienCard key={technicien.id} technicien={technicien} />
          ))}
        </div>
      )}
    </div>
  );
}