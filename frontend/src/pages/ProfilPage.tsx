import { useEffect, useState } from 'react';
import { getEquipes } from '../api/referentielService';
import { getProfil } from '../api/profilService';
import DisponibiliteCard from '../components/profil/DisponibiliteCard';
import MotDePasseForm from '../components/profil/MotDePasseForm';
import ProfilInfosForm from '../components/profil/ProfilInfosForm';
import { useAuth } from '../hooks/useAuth';
import { messageErreur } from '../utils/erreurs';
import type { Equipe } from '../types/referentiel';
import type { Utilisateur } from '../types/user';

export default function ProfilPage() {
  const { mettreAJourUtilisateur } = useAuth();

  const [profil, setProfil] = useState<Utilisateur | null>(null);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const [donneesProfil, listeEquipes] = await Promise.all([getProfil(), getEquipes()]);
        setProfil(donneesProfil);
        setEquipes(listeEquipes);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger votre profil.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, []);

  const apresModification = (utilisateur: Utilisateur) => {
    setProfil(utilisateur);
    mettreAJourUtilisateur(utilisateur);
  };

  const equipeNom =
    profil && profil.equipe_id !== null
      ? (equipes.find((e) => e.id === profil.equipe_id)?.nom ?? null)
      : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
      <p className="mt-1 text-sm text-slate-500">Vos informations et paramètres de compte</p>

      {loading && <p className="mt-8 text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {profil && (
        <div className="mt-6 grid max-w-3xl gap-6">
          <ProfilInfosForm profil={profil} equipeNom={equipeNom} onSucces={apresModification} />

          {profil.role === 'technicien' && (
            <DisponibiliteCard profil={profil} onChange={apresModification} />
          )}

          <MotDePasseForm />
        </div>
      )}
    </div>
  );
}