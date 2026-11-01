import type { ReactNode } from 'react';

interface AuthLayoutProps {
  titre: string;
  sousTitre: string;
  pied: ReactNode;
  children: ReactNode;
}

export default function AuthLayout({ titre, sousTitre, pied, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-center bg-blue-700 px-16 text-white lg:flex">
        <h1 className="text-4xl font-bold">Helpdesk</h1>
        <p className="mt-6 max-w-md text-2xl font-semibold leading-snug">
          Un problème informatique ? Signalez-le en quelques clics.
        </p>
        <p className="mt-4 max-w-md text-blue-100">
          Créez un ticket, suivez son avancement et échangez avec le technicien en charge.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-10">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-slate-900">{titre}</h2>
          <p className="mt-1 text-sm text-slate-500">{sousTitre}</p>

          {children}

          <p className="mt-6 text-center text-sm text-slate-500">{pied}</p>
        </div>
      </div>
    </div>
  );
}