import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTickets, prendreTicket } from '../api/ticketService';
import { getCategories, getPriorites } from '../api/referentielService';
import QueueTable from '../components/tickets/QueueTable';
import TicketFilters from '../components/tickets/TicketFilters';
import { messageErreur } from '../utils/erreurs';
import type { Categorie, Priorite } from '../types/referentiel';
import type { Ticket } from '../types/ticket';

export default function FileAttentePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [priorites, setPriorites] = useState<Priorite[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurAction, setErreurAction] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);
  const [enCoursId, setEnCoursId] = useState<number | null>(null);
  const [rechargement, setRechargement] = useState<number>(0);

  const [recherche, setRecherche] = useState<string>('');
  const [prioriteFiltre, setPrioriteFiltre] = useState<string>('');
  const [categorieFiltre, setCategorieFiltre] = useState<string>('');

  useEffect(() => {
    const charger = async () => {
      try {
        const [listeTickets, listePriorites, listeCategories] = await Promise.all([
          getTickets(),
          getPriorites(),
          getCategories(),
        ]);
        setTickets(listeTickets);
        setPriorites(listePriorites);
        setCategories(listeCategories);
      } catch (e) {
        setErreur(messageErreur(e, "Impossible de charger la file d'attente."));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, [rechargement]);

  const totalEnAttente = tickets.filter((t) => t.technicien_id === null && !t.est_final).length;

  const ticketsAffiches = useMemo(() => {
    const niveaux = new Map(priorites.map((p) => [p.id, p.niveau_ordre]));
    const terme = recherche.trim().toLowerCase();

    return tickets
      .filter((t) => t.technicien_id === null && !t.est_final)
      .filter((t) => {
        if (
          terme &&
          !t.sujet.toLowerCase().includes(terme) &&
          !t.numero.toLowerCase().includes(terme)
        ) {
          return false;
        }
        if (prioriteFiltre && t.priorite_id !== Number(prioriteFiltre)) {
          return false;
        }
        if (categorieFiltre && t.categorie_id !== Number(categorieFiltre)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const niveauA = niveaux.get(a.priorite_id) ?? 99;
        const niveauB = niveaux.get(b.priorite_id) ?? 99;
        return (
          niveauA - niveauB ||
          new Date(a.date_creation).getTime() - new Date(b.date_creation).getTime()
        );
      });
  }, [tickets, priorites, recherche, prioriteFiltre, categorieFiltre]);

  const prendre = async (ticket: Ticket) => {
    setErreurAction(null);
    setSucces(null);
    setEnCoursId(ticket.id);
    try {
      const misAJour = await prendreTicket(ticket.id);
      setTickets((prev) => prev.map((t) => (t.id === misAJour.id ? misAJour : t)));
      setSucces(`Le ticket ${misAJour.numero} vous est assigné.`);
    } catch (e) {
      setErreurAction(messageErreur(e, 'Impossible de prendre ce ticket.'));
      setRechargement((n) => n + 1);
    } finally {
      setEnCoursId(null);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">File d'attente</h1>
          <p className="mt-1 text-sm text-slate-500">Tickets en attente de prise en charge</p>
        </div>
        <button
          onClick={() => setRechargement((n) => n + 1)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Actualiser
        </button>
      </div>

      {loading && <p className="mt-8 text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {!loading && !erreur && (
        <>
          <div className="mt-6">
            <TicketFilters
              recherche={recherche}
              onRecherche={setRecherche}
              placeholderRecherche="Rechercher un ticket"
              priorite={prioriteFiltre}
              onPriorite={setPrioriteFiltre}
              priorites={priorites}
              categorie={categorieFiltre}
              onCategorie={setCategorieFiltre}
              categories={categories}
            />
          </div>

          {succes && (
            <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {succes}{' '}
              <Link to="/mes-tickets" className="font-medium underline">
                Voir mes tickets
              </Link>
            </p>
          )}

          {erreurAction && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {erreurAction}
            </p>
          )}

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-900">
              Tickets non assignés · {totalEnAttente}
            </h2>

            {ticketsAffiches.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                {totalEnAttente === 0
                  ? 'Aucun ticket en attente de prise en charge.'
                  : 'Aucun ticket ne correspond à votre recherche.'}
              </p>
            ) : (
              <div className="mt-4">
                <QueueTable tickets={ticketsAffiches} enCoursId={enCoursId} onPrendre={prendre} />
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Astuce : les tickets les plus urgents sont affichés en premier, puis les plus anciens.
          </p>
        </>
      )}
    </div>
  );
}