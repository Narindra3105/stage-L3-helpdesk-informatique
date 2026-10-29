import { calculerDelai, resolutionDansLesDelais } from '../../utils/sla';
import { formatDuree } from '../../utils/format';
import type { Ticket } from '../../types/ticket';

interface SlaCardProps {
  ticket: Ticket;
}

export default function SlaCard({ ticket }: SlaCardProps) {
  let valeur = '—';
  let detail = 'Aucun délai SLA défini';
  let enRetard = false;

  if (ticket.date_limite_resolution) {
    if (ticket.est_final) {
      const dansLesDelais = resolutionDansLesDelais(ticket);
      if (dansLesDelais !== null) {
        valeur = dansLesDelais ? 'Respecté' : 'Dépassé';
        detail = dansLesDelais ? 'Résolu dans les délais' : 'Résolu après la date limite';
        enRetard = !dansLesDelais;
      }
    } else {
      const delai = calculerDelai(ticket);
      if (delai) {
        if (delai.restantMinutes >= 0) {
          valeur = formatDuree(delai.restantMinutes);
          detail = `restantes sur ${formatDuree(delai.totalMinutes)}`;
        } else {
          valeur = formatDuree(-delai.restantMinutes);
          detail = 'de dépassement';
          enRetard = true;
        }
      }
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Délai SLA</h2>
      <p className={`mt-3 text-3xl font-bold ${enRetard ? 'text-red-600' : 'text-slate-900'}`}>
        {valeur}
      </p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </div>
  );
}