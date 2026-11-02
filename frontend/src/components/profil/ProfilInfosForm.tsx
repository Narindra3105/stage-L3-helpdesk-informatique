import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { modifierProfil } from '../../api/profilService';
import { formatDateHeure } from '../../utils/date';
import { codeStatut, erreursChamps, messageErreur } from '../../utils/erreurs';
import { libellesRole } from '../../utils/roles';
import { classeChamp, classeLabel } from '../../utils/styles';
import type { Utilisateur } from '../../types/user';

interface FormulaireInfos {
  nom: string;
  prenom: string;
  email: string;
}

interface ProfilInfosFormProps {
  profil: Utilisateur;
  equipeNom: string | null;
  onSucces: (utilisateur: Utilisateur) => void;
}

const champsConnus: string[] = ['nom', 'prenom', 'email'];

const estChampConnu = (champ: string): champ is keyof FormulaireInfos => {
  return champsConnus.includes(champ);
};

export default function ProfilInfosForm({ profil, equipeNom, onSucces }: ProfilInfosFormProps) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormulaireInfos>({
    defaultValues: {
      nom: profil.nom,
      prenom: profil.prenom ?? '',
      email: profil.email,
    },
  });

  const onSubmit = async (data: FormulaireInfos) => {
    setErreur(null);
    setSucces(false);

    const prenom = data.prenom.trim();
    try {
      const misAJour = await modifierProfil({
        nom: data.nom.trim(),
        prenom: prenom === '' ? null : prenom,
        email: data.email.trim(),
      });
      onSucces(misAJour);
      reset({ nom: misAJour.nom, prenom: misAJour.prenom ?? '', email: misAJour.email });
      setSucces(true);
    } catch (e) {
      let champAssocie = false;
      for (const { champ, message } of erreursChamps(e)) {
        if (estChampConnu(champ)) {
          setError(champ, { message });
          champAssocie = true;
        }
      }

      if (!champAssocie && codeStatut(e) === 409) {
        setError('email', { message: messageErreur(e, 'Cet email est déjà utilisé') });
        champAssocie = true;
      }

      if (!champAssocie) {
        setErreur(messageErreur(e, 'Impossible d\'enregistrer vos informations.'));
      }
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Mes informations</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nom" className={classeLabel}>
              Nom
            </label>
            <input
              id="nom"
              type="text"
              className={classeChamp}
              {...register('nom', {
                required: 'Le nom est obligatoire',
                maxLength: { value: 100, message: 'Le nom ne doit pas dépasser 100 caractères' },
              })}
            />
            {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>}
          </div>

          <div>
            <label htmlFor="prenom" className={classeLabel}>
              Prénom (facultatif)
            </label>
            <input
              id="prenom"
              type="text"
              className={classeChamp}
              {...register('prenom', {
                maxLength: { value: 100, message: 'Le prénom ne doit pas dépasser 100 caractères' },
              })}
            />
            {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={classeLabel}>
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            className={classeChamp}
            {...register('email', {
              required: "L'adresse e-mail est obligatoire",
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Adresse e-mail invalide' },
              maxLength: { value: 150, message: "L'e-mail ne doit pas dépasser 150 caractères" },
            })}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

        {succes && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Vos informations ont été enregistrées.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>

      <dl className="mt-6 divide-y divide-slate-100 border-t border-slate-100 text-sm">
        <div className="flex justify-between py-2.5">
          <dt className="text-slate-500">Rôle</dt>
          <dd className="font-medium text-slate-900">{libellesRole[profil.role]}</dd>
        </div>
        <div className="flex justify-between py-2.5">
          <dt className="text-slate-500">Équipe</dt>
          <dd className="font-medium text-slate-900">{equipeNom ?? '—'}</dd>
        </div>
        <div className="flex justify-between py-2.5">
          <dt className="text-slate-500">Dernière connexion</dt>
          <dd className="font-medium text-slate-900">{formatDateHeure(profil.derniere_activite)}</dd>
        </div>
      </dl>
    </div>
  );
}