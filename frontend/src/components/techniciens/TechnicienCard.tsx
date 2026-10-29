import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import type { CouleurBadge } from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { estSurcharge, pourcentageCharge } from '../../utils/charge';
import { initiales, nomComplet } from '../../utils/format';
import type { StatTechnicien } from '../../types/stats';
import type { StatutUtilisateur } from '../../types/user';

const statuts: Record<StatutUtilisateur, { libelle: string; couleur: CouleurBadge }> = {
  actif: { libelle: 'Actif', couleur: 'vert' },
  absent: { libelle: 'Absent', couleur: 'orange' },
  inactif: { libelle: 'Inactif', couleur: 'gris' },
};

interface TechnicienCardProps {
  technicien: StatTechnicien;
  onModifier: (technicien: StatTechnicien) => void;
}

export default function TechnicienCard({ technicien, onModifier }: TechnicienCardProps) {
  const statut = statuts[technicien.statut];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <Avatar texte={initiales(technicien.prenom, technicien.nom)} taille="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {nomComplet(technicien.prenom, technicien.nom)}
          </p>
          <p className="truncate text-sm text-slate-500">
            {technicien.equipe_nom ?? 'Sans équipe'}
          </p>
        </div>
        <Badge couleur={statut.couleur}>{statut.libelle}</Badge>
      </div>

      <dl className="mt-4 divide-y divide-slate-100 border-t border-slate-100 text-sm">
        <div className="flex justify-between py-2.5">
          <dt className="text-slate-500">Tickets en cours</dt>
          <dd className="font-semibold text-slate-900">{technicien.tickets_en_cours}</dd>
        </div>
        <div className="flex justify-between py-2.5">
          <dt className="text-slate-500">Résolus ce mois</dt>
          <dd className="font-semibold text-slate-900">{technicien.resolus_ce_mois}</dd>
        </div>
      </dl>

      <div className="mt-2">
        <p className="mb-1.5 text-sm text-slate-500">Charge de travail</p>
        <ProgressBar
          pourcentage={pourcentageCharge(technicien.tickets_en_cours)}
          danger={estSurcharge(technicien.tickets_en_cours)}
        />
      </div>

      <button
        onClick={() => onModifier(technicien)}
        className="mt-4 w-full rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Modifier
      </button>
    </div>
  );
}