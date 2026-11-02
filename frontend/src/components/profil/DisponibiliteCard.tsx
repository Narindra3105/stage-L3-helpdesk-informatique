import { useState } from 'react';
import { changerDisponibilite } from '../../api/profilService';
import Badge from '../common/Badge';
import { messageErreur } from '../../utils/erreurs';
import { infosStatutUtilisateur, libellesDisponibilite } from '../../utils/utilisateurs';
import type { Utilisateur } from '../../types/user';

interface DisponibiliteCardProps {
  profil: Utilisateur;
  onChange: (utilisateur: Utilisateur) => void;
}

export default function DisponibiliteCard({ profil, onChange }: DisponibiliteCardProps) {
  const [enCours, setEnCours] = useState<boolean>(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const disponible = profil.statut === 'actif';

  const basculer = async () => {
    setErreur(null);
    setEnCours(true);
    try {
      const misAJour = await changerDisponibilite(disponible ? 'absent' : 'actif');
      onChange(misAJour);
    } catch (e) {
      setErreur(messageErreur(e, 'Impossible de modifier votre disponibilité.'));
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Disponibilité</h2>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-slate-600">Statut actuel</span>
        <Badge couleur={infosStatutUtilisateur[profil.statut].couleur}>
          {libellesDisponibilite[profil.statut]}
        </Badge>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <span id="libelle-disponibilite" className="text-sm text-slate-600">
          Recevoir de nouvelles assignations
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={disponible}
          aria-labelledby="libelle-disponibilite"
          onClick={basculer}
          disabled={enCours}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
            disponible ? 'bg-blue-700' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              disponible ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Absent : les nouveaux tickets ne peuvent plus vous être assignés, ni être pris depuis la
        file d'attente. Vos tickets en cours sont conservés.
      </p>

      {erreur && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}
    </div>
  );
}