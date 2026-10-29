import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { changerStatut, getTickets } from '../api/ticketService';
import { getPriorites, getStatuts } from '../api/referentielService';
import { useAuth } from '../hooks/useAuth';
import TicketBoard from '../components/tickets/TicketBoard';
import type { Priorite, Statut } from '../types/referentiel';
import type { Ticket } from '../types/ticket';
import TicketFilters from '../components/tickets/TicketFilters';

export default function TicketsPage() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statuts, setStatuts] = useState<Statut[]>([]);
  const [priorites, setPriorites] = useState<Priorite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurDeplacement, setErreurDeplacement] = useState<string | null>(null);

  const [recherche, setRecherche] = useState<string>('');
  const [prioriteFiltre, setPrioriteFiltre] = useState<string>('');
  const [technicienFiltre, setTechnicienFiltre] = useState<string>('');

  useEffect(() => {
    const charger = async () => {
      try {
        const [listeTickets, listeStatuts, listePriorites] = await Promise.all([
          getTickets(),
          getStatuts(),
          getPriorites(),
        ]);
        setTickets(listeTickets);
        setStatuts(listeStatuts);
        setPriorites(listePriorites);
      } catch {
        setErreur('Impossible de charger les tickets.');
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, []);

  const techniciens = useMemo(() => {
    const parId = new Map<number, string>();
    tickets.forEach((t) => {
      if (t.technicien_id !== null && t.technicien_nom) {
        parId.set(t.technicien_id, t.technicien_nom);
      }
    });
    return Array.from(parId, ([id, nom]) => ({ id, nom }));
  }, [tickets]);

  const ticketsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return tickets.filter((t) => {
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
      if (technicienFiltre === 'aucun' && t.technicien_id !== null) {
        return false;
      }
      if (
        technicienFiltre &&
        technicienFiltre !== 'aucun' &&
        t.technicien_id !== Number(technicienFiltre)
      ) {
        return false;
      }
      return true;
    });
  }, [tickets, recherche, prioriteFiltre, technicienFiltre]);

  const peutDeplacer = (ticket: Ticket): boolean => {
    if (!user) {
      return false;
    }
    if (user.role === 'admin') {
      return true;
    }
    return user.role === 'technicien' && ticket.technicien_id === user.id;
  };

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
      const message = isAxiosError(e) ? e.response?.data?.message : undefined;
      setErreurDeplacement(message ?? 'Impossible de modifier le statut du ticket.');
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tickets</h1>
          <p className="mt-1 text-sm text-slate-500">
            Glissez les cartes d'une colonne à l'autre pour changer le statut
          </p>
        </div>
        <Link
          to="/nouveau-ticket"
          className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Nouveau ticket
        </Link>
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
              priorite={prioriteFiltre}
              onPriorite={setPrioriteFiltre}
              technicien={technicienFiltre}
              onTechnicien={setTechnicienFiltre}
              priorites={priorites}
              techniciens={techniciens}
            />
          </div>

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
            />
          </div>
        </>
      )}
    </div>
  );
}