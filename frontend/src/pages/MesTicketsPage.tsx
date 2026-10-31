import { useEffect, useMemo, useState } from 'react';
import { changerStatut, getTickets } from '../api/ticketService';
import { getCategories, getPriorites, getStatuts } from '../api/referentielService';
import TicketBoard from '../components/tickets/TicketBoard';
import TicketFilters from '../components/tickets/TicketFilters';
import { useAuth } from '../hooks/useAuth';
import { messageErreur } from '../utils/erreurs';
import { peutChangerStatut } from '../utils/permissions';
import type { Categorie, Priorite, Statut } from '../types/referentiel';
import type { Ticket } from '../types/ticket';

export default function MesTicketsPage() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statuts, setStatuts] = useState<Statut[]>([]);
  const [priorites, setPriorites] = useState<Priorite[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurDeplacement, setErreurDeplacement] = useState<string | null>(null);

  const [recherche, setRecherche] = useState<string>('');
  const [prioriteFiltre, setPrioriteFiltre] = useState<string>('');
  const [categorieFiltre, setCategorieFiltre] = useState<string>('');

  useEffect(() => {
    const charger = async () => {
      try {
        const [listeTickets, listeStatuts, listePriorites, listeCategories] = await Promise.all([
          getTickets(),
          getStatuts(),
          getPriorites(),
          getCategories(),
        ]);
        setTickets(listeTickets);
        setStatuts(listeStatuts);
        setPriorites(listePriorites);
        setCategories(listeCategories);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger vos tickets.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, []);

  const mesTickets = useMemo(() => {
    if (user === null) {
      return [];
    }
    return tickets.filter((t) => t.technicien_id === user.id);
  }, [tickets, user]);

  const ticketsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return mesTickets.filter((t) => {
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
    });
  }, [mesTickets, recherche, prioriteFiltre, categorieFiltre]);

  const peutDeplacer = (ticket: Ticket): boolean => peutChangerStatut(user, ticket);

  const deplacer = async (ticketId: number, statutId: number) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    const statut = statuts.find((s) => s.id === statutId);

    if (!ticket || !statut || ticket.statut_id === statutId || !peutDeplacer(ticket)) {
      return;
    }

    setErreurDeplacement(null);
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, statut_id: statut.id, statut_nom: statut.nom, est_final: statut.est_final }
          : t
      )
    );

    try {
      const misAJour = await changerStatut(ticketId, statutId);
      setTickets((prev) => prev.map((t) => (t.id === misAJour.id ? misAJour : t)));
    } catch (e) {
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? ticket : t)));
      setErreurDeplacement(messageErreur(e, 'Impossible de modifier le statut du ticket.'));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Mes tickets</h1>
      <p className="mt-1 text-sm text-slate-500">Glissez une carte pour changer son statut</p>

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
              placeholderRecherche="Rechercher dans mes tickets"
              priorite={prioriteFiltre}
              onPriorite={setPrioriteFiltre}
              priorites={priorites}
              categorie={categorieFiltre}
              onCategorie={setCategorieFiltre}
              categories={categories}
            />
          </div>

          {mesTickets.length === 0 && (
            <p className="mt-4 text-sm text-slate-500">
              Aucun ticket ne vous est assigné pour le moment.
            </p>
          )}

          {erreurDeplacement && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {erreurDeplacement}
            </p>
          )}

          <div className="mt-6">
            <TicketBoard
              statuts={statuts}
              tickets={ticketsFiltres}
              peutDeplacer={peutDeplacer}
              onDeplacer={deplacer}
              variante="technicien"
            />
          </div>
        </>
      )}
    </div>
  );
}