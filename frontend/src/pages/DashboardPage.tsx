import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
      <p className="mt-2 text-slate-600">
        Connecté : {user?.nom} ({user?.role})
      </p>
      <button
        onClick={logout}
        className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Déconnexion
      </button>
    </div>
  );
}