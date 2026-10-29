import { formatDateHeure } from '../../utils/date';
import { nomComplet } from '../../utils/format';
import type { Ticket } from '../../types/ticket';

interface TicketInfoProps {
  ticket: Ticket;
}

interface Ligne {
  label: string;
  valeur: string;
}

export default function TicketInfo({ ticket }: TicketInfoProps) {
  const lignes: Ligne[] = [
    { label: 'Demandeur', valeur: nomComplet(ticket.demandeur_prenom, ticket.demandeur_nom) },
    { label: 'Technicien', valeur: ticket.technicien_nom ?? 'Non assigné' },
    { label: 'Équipe', valeur: ticket.equipe_nom },
    { label: 'Catégorie', valeur: ticket.categorie_nom ?? '—' },
    { label: 'Créé le', valeur: formatDateHeure(ticket.date_creation) },
    { label: 'Première réponse', valeur: formatDateHeure(ticket.date_premiere_reponse) },
    { label: 'Résolu le', valeur: formatDateHeure(ticket.date_resolution) },
  ];

  if (ticket.nb_reouvertures > 0) {
    lignes.push({ label: 'Réouvertures', valeur: String(ticket.nb_reouvertures) });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Informations</h2>
      <dl className="mt-3 divide-y divide-slate-100">
        {lignes.map((ligne) => (
          <div key={ligne.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
            <dt className="text-slate-500">{ligne.label}</dt>
            <dd className="text-right font-medium text-slate-900">{ligne.valeur}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}