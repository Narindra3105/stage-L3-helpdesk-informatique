import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { inscrire } from '../api/authService';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { codeStatut, erreursChamps, messageErreur } from '../utils/erreurs';
import { classeChamp, classeLabel } from '../utils/styles';

interface FormulaireInscription {
  nom: string;
  prenom: string;
  email: string;
  mdp: string;
  confirmation: string;
}

const champsConnus: string[] = ['nom', 'prenom', 'email', 'mdp'];

const estChampConnu = (champ: string): champ is 'nom' | 'prenom' | 'email' | 'mdp' => {
  return champsConnus.includes(champ);
};

export default function RegisterPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [erreur, setErreur] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormulaireInscription>({
    defaultValues: { nom: '', prenom: '', email: '', mdp: '', confirmation: '' },
  });

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: FormulaireInscription) => {
    setErreur(null);

    const prenom = data.prenom.trim();
    const email = data.email.trim();

    try {
      await inscrire({
        nom: data.nom.trim(),
        prenom: prenom === '' ? null : prenom,
        email,
        mdp: data.mdp,
      });
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
        setErreur(messageErreur(e, 'Impossible de créer le compte. Réessayez plus tard.'));
      }
      return;
    }

    try {
      await login({ email, mdp: data.mdp });
      navigate('/', { replace: true });
    } catch {
      setErreur(
        'Votre compte a été créé, mais la connexion automatique a échoué. Connectez-vous depuis la page de connexion.'
      );
    }
  };

  return (
    <AuthLayout
      titre="Créer un compte"
      sousTitre="Renseignez vos informations pour accéder à votre espace."
      pied={
        <>
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-blue-700 hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nom" className={classeLabel}>
              Nom
            </label>
            <input
              id="nom"
              type="text"
              autoComplete="family-name"
              className={classeChamp}
              {...register('nom', {
                required: 'Le nom est obligatoire',
                maxLength: { value: 100, message: 'Au plus 100 caractères' },
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
              autoComplete="given-name"
              className={classeChamp}
              {...register('prenom', {
                maxLength: { value: 100, message: 'Au plus 100 caractères' },
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
            placeholder="nom@entreprise.com"
            autoComplete="email"
            className={classeChamp}
            {...register('email', {
              required: "L'adresse e-mail est obligatoire",
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Adresse e-mail invalide' },
              maxLength: { value: 150, message: "L'e-mail ne doit pas dépasser 150 caractères" },
            })}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="mdp" className={classeLabel}>
            Mot de passe
          </label>
          <input
            id="mdp"
            type="password"
            placeholder="8 caractères minimum"
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
            type="password"
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

        {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Création du compte...' : 'Créer mon compte'}
        </button>
      </form>
    </AuthLayout>
  );
}