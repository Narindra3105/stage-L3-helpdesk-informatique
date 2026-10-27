import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../hooks/useAuth';
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
        } else {
          setErreur('Une erreur est survenue sur le serveur. Réessayez plus tard.');
        }
      } else {
        setErreur('Impossible de joindre le serveur.');
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-center bg-blue-700 px-16 text-white lg:flex">
        <h1 className="text-4xl font-bold">Helpdesk</h1>
        <p className="mt-6 max-w-md text-2xl font-semibold leading-snug">
          Suivez et résolvez les incidents informatiques de l'entreprise.
        </p>
        <p className="mt-4 max-w-md text-blue-100">
          Tickets, priorités, techniciens et respect des délais SLA, au même endroit.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-slate-900">Connexion</h2>
          <p className="mt-1 text-sm text-slate-500">Accédez à votre espace.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="nom@entreprise.com"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                {...register('email', {
                  required: "L'adresse e-mail est obligatoire",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Adresse e-mail invalide',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="mdp" className="block text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <input
                id="mdp"
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                {...register('mdp', { required: 'Le mot de passe est obligatoire' })}
              />
              {errors.mdp && (
                <p className="mt-1 text-sm text-red-600">{errors.mdp.message}</p>
              )}
            </div>

            {erreur && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}