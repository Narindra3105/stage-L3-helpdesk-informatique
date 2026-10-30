import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { initiales, nomComplet } from '../../utils/format';
import { libellesRole } from '../../utils/roles';

const liens = [
  { to: '/', label: 'Tableau de bord', end: true },
  { to: '/tickets', label: 'Tickets', end: false },
  { to: '/nouveau-ticket', label: 'Nouveau ticket', end: false },
  { to: '/techniciens', label: 'Techniciens', end: false },
  { to: '/utilisateurs', label: 'Utilisateurs', end: false },
  { to: '/rapports-sla', label: 'Rapports SLA', end: false },
  { to: '/parametres', label: 'Paramètres', end: false },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  const nomUtilisateur = user ? nomComplet(user.prenom, user.nom) : '';
  const initialesUtilisateur = user ? initiales(user.prenom, user.nom) : '';

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-5 print:hidden">
      <div className="flex items-center gap-2 px-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700">
          <div className="h-4 w-4 rounded-sm border-2 border-white" />
        </div>
        <span className="text-xl font-bold text-blue-700">Helpdesk</span>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {liens.map((lien) => (
          <NavLink
            key={lien.to}
            to={lien.to}
            end={lien.end}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {lien.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-slate-200 px-3 pt-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
          {initialesUtilisateur}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{nomUtilisateur}</p>
          <p className="text-xs text-slate-500">{user ? libellesRole[user.role] : ''}</p>
        </div>
        <button
          onClick={logout}
          title="Déconnexion"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}