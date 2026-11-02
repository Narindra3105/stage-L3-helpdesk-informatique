import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { changerMotDePasse } from '../../api/profilService';
import { codeStatut, erreursChamps, messageErreur } from '../../utils/erreurs';
import { classeChamp, classeLabel } from '../../utils/styles';

interface FormulaireMdp {
  mdp_actuel: string;
  nouveau_mdp: string;
  confirmation: string;
}

const champsConnus: string[] = ['mdp_actuel', 'nouveau_mdp'];

const estChampConnu = (champ: string): champ is 'mdp_actuel' | 'nouveau_mdp' => {
  return champsConnus.includes(champ);
};

export default function MotDePasseForm() {
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<boolean>(false);
  const [afficher, setAfficher] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormulaireMdp>({
    defaultValues: { mdp_actuel: '', nouveau_mdp: '', confirmation: '' },
  });

  const onSubmit = async (data: FormulaireMdp) => {
    setErreur(null);
    setSucces(false);

    try {
      await changerMotDePasse({ mdp_actuel: data.mdp_actuel, nouveau_mdp: data.nouveau_mdp });
      reset();
      setSucces(true);
    } catch (e) {
      let champAssocie = false;
      for (const { champ, message } of erreursChamps(e)) {
        if (estChampConnu(champ)) {
          setError(champ, { message });
          champAssocie = true;
        }
      }

      if (!champAssocie && codeStatut(e) === 400) {
        setError('mdp_actuel', { message: messageErreur(e, 'Mot de passe incorrect') });
        champAssocie = true;
      }

      if (!champAssocie) {
        setErreur(messageErreur(e, 'Impossible de modifier le mot de passe.'));
      }
    }
  };

  const typeChamp = afficher ? 'text' : 'password';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Sécurité</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
        <div>
          <label htmlFor="mdp_actuel" className={classeLabel}>
            Mot de passe actuel
          </label>
          <input
            id="mdp_actuel"
            type={typeChamp}
            autoComplete="current-password"
            className={classeChamp}
            {...register('mdp_actuel', { required: 'Le mot de passe actuel est obligatoire' })}
          />
          {errors.mdp_actuel && (
            <p className="mt-1 text-sm text-red-600">{errors.mdp_actuel.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="nouveau_mdp" className={classeLabel}>
            Nouveau mot de passe
          </label>
          <input
            id="nouveau_mdp"
            type={typeChamp}
            autoComplete="new-password"
            className={classeChamp}
            {...register('nouveau_mdp', {
              required: 'Le nouveau mot de passe est obligatoire',
              minLength: { value: 8, message: 'Au moins 8 caractères' },
              maxLength: { value: 72, message: 'Au plus 72 caractères' },
              validate: (valeur, valeurs) =>
                valeur !== valeurs.mdp_actuel || "Il doit être différent de l'actuel",
            })}
          />
          {errors.nouveau_mdp && (
            <p className="mt-1 text-sm text-red-600">{errors.nouveau_mdp.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmation" className={classeLabel}>
            Confirmer le nouveau mot de passe
          </label>
          <input
            id="confirmation"
            type={typeChamp}
            autoComplete="new-password"
            className={classeChamp}
            {...register('confirmation', {
              required: 'Veuillez confirmer le mot de passe',
              validate: (valeur, valeurs) =>
                valeur === valeurs.nouveau_mdp || 'Les deux mots de passe ne correspondent pas',
            })}
          />
          {errors.confirmation && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmation.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={afficher}
            onChange={(e) => setAfficher(e.target.checked)}
          />
          Afficher les mots de passe
        </label>

        {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

        {succes && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Votre mot de passe a été modifié.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Enregistrement...' : 'Modifier le mot de passe'}
        </button>
      </form>
    </div>
  );
}