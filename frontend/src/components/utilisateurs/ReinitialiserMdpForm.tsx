import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { reinitialiserMdp } from '../../api/utilisateurService';
import { erreursChamps, messageErreur } from '../../utils/erreurs';
import { nomComplet } from '../../utils/format';
import { genererMotDePasse } from '../../utils/motDePasse';
import { classeChamp, classeLabel } from '../../utils/styles';
import type { Utilisateur } from '../../types/user';

interface FormulaireMdp {
  mdp: string;
  confirmation: string;
}

interface ReinitialiserMdpFormProps {
  utilisateur: Utilisateur;
  onFermer: () => void;
}

export default function ReinitialiserMdpForm({
  utilisateur,
  onFermer,
}: ReinitialiserMdpFormProps) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [afficher, setAfficher] = useState<boolean>(false);
  const [motDePasseDefini, setMotDePasseDefini] = useState<string | null>(null);
  const [copie, setCopie] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormulaireMdp>({
    defaultValues: { mdp: '', confirmation: '' },
  });

  const generer = () => {
    const genere = genererMotDePasse();
    setValue('mdp', genere, { shouldValidate: true });
    setValue('confirmation', genere, { shouldValidate: true });
    setAfficher(true);
  };

  const copier = async () => {
    if (motDePasseDefini === null) {
      return;
    }
    try {
      await navigator.clipboard.writeText(motDePasseDefini);
      setCopie(true);
    } catch {
      setCopie(false);
    }
  };

  const onSubmit = async (data: FormulaireMdp) => {
    setErreur(null);
    try {
      await reinitialiserMdp(utilisateur.id, data.mdp);
      setMotDePasseDefini(data.mdp);
    } catch (e) {
      let champAssocie = false;
      for (const { champ, message } of erreursChamps(e)) {
        if (champ === 'mdp') {
          setError('mdp', { message });
          champAssocie = true;
        }
      }
      if (!champAssocie) {
        setErreur(messageErreur(e, 'Impossible de réinitialiser le mot de passe.'));
      }
    }
  };

  const nom = nomComplet(utilisateur.prenom, utilisateur.nom);

  if (motDePasseDefini !== null) {
    return (
      <div className="space-y-4">
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Le mot de passe de {nom} a été réinitialisé.
        </p>
        <div>
          <p className={classeLabel}>Nouveau mot de passe</p>
          <div className="mt-1 flex gap-3">
            <input
              readOnly
              value={motDePasseDefini}
              aria-label="Nouveau mot de passe"
              className={`${classeChamp} mt-0 bg-slate-50 font-mono`}
            />
            <button
              type="button"
              onClick={copier}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {copie ? 'Copié' : 'Copier'}
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Communiquez-le à l'utilisateur : il ne sera plus affiché après la fermeture de cette
          fenêtre.
        </p>
        <button
          type="button"
          onClick={onFermer}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Fermer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <p className="text-sm text-slate-600">
        Définir un nouveau mot de passe pour <span className="font-semibold">{nom}</span>
        <span className="text-slate-500"> ({utilisateur.email})</span>.
      </p>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="mdp" className={classeLabel}>
            Nouveau mot de passe
          </label>
          <button
            type="button"
            onClick={generer}
            className="text-xs font-medium text-blue-700 hover:underline"
          >
            Générer un mot de passe
          </button>
        </div>
        <input
          id="mdp"
          type={afficher ? 'text' : 'password'}
          autoComplete="new-password"
          className={classeChamp}
          {...register('mdp', {
            required: 'Le mot de passe est obligatoire',
            minLength: { value: 8, message: 'Au moins 8 caractères' },
            maxLength: { value: 72, message: 'Au plus 72 caractères' },
          })}
        />
        {errors.mdp && <p className="mt-1 text-sm text-red-600">{errors.mdp.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmation" className={classeLabel}>
          Confirmer le mot de passe
        </label>
        <input
          id="confirmation"
          type={afficher ? 'text' : 'password'}
          autoComplete="new-password"
          className={classeChamp}
          {...register('confirmation', {
            required: 'Veuillez confirmer le mot de passe',
            validate: (valeur, valeurs) =>
              valeur === valeurs.mdp || 'Les deux mots de passe ne correspondent pas',
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
        Afficher le mot de passe
      </label>

      {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Enregistrement...' : 'Réinitialiser'}
        </button>
        <button
          type="button"
          onClick={onFermer}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}