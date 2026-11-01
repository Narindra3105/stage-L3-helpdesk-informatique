import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { classeChamp, classeLabel } from '../utils/styles';
import type { LoginPayload } from '../types/auth';

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [erreur, setErreur] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>();

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginPayload) => {
    setErreur(null);
    try {
      await login(data);
      navigate('/', { replace: true });
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        const status = e.response.status;
        if (status === 400 || status === 401) {
          setErreur('Adresse e-mail ou mot de passe incorrect.');
        } else if (status === 403) {
          setErreur('Ce compte a été désactivé. Contactez un administrateur.');
        } else {
          setErreur('Une erreur est survenue sur le serveur. Réessayez plus tard.');
        }
      } else {
        setErreur('Impossible de joindre le serveur.');
      }
    }
  };

  return (
    <AuthLayout
      titre="Connexion"
      sousTitre="Accédez à votre espace."
      pied={
        <>
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-medium text-blue-700 hover:underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="email" className={classeLabel}>
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="nom@entreprise.com"
            className={classeChamp}
            {...register('email', {
              required: "L'adresse e-mail est obligatoire",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Adresse e-mail invalide',
              },
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
            placeholder="••••••••"
            className={classeChamp}
            {...register('mdp', { required: 'Le mot de passe est obligatoire' })}
          />
          {errors.mdp && <p className="mt-1 text-sm text-red-600">{errors.mdp.message}</p>}
        </div>

        {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </AuthLayout>
  );
}