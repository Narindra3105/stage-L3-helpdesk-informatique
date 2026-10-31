import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { creerTicket } from '../../api/ticketService';
import { getCategories, getEquipes, getPriorites } from '../../api/referentielService';
import { useAuth } from '../../hooks/useAuth';
import { messageErreur } from '../../utils/erreurs';
import { nomComplet } from '../../utils/format';
import { classeChamp, classeLabel } from '../../utils/styles';
import type { Categorie, Equipe, Priorite } from '../../types/referentiel';
import type { Ticket } from '../../types/ticket';

interface FormulaireTicket {
  sujet: string;
  categorie_id: string;
  priorite_id: string;
  equipe_id: string;
  description: string;
}

interface NouveauTicketFormProps {
  onSucces: (ticket: Ticket) => void;
  onAnnuler: () => void;
}

export default function NouveauTicketForm({ onSucces, onAnnuler }: NouveauTicketFormProps) {
  const { user } = useAuth();

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [priorites, setPriorites] = useState<Priorite[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreurChargement, setErreurChargement] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormulaireTicket>({
    defaultValues: {
      sujet: '',
      categorie_id: '',
      priorite_id: '',
      equipe_id: '',
      description: '',
    },
  });

  useEffect(() => {
    const charger = async () => {
      try {
        const [listeCategories, listePriorites, listeEquipes] = await Promise.all([
          getCategories(),
          getPriorites(),
          getEquipes(),
        ]);
        setCategories(listeCategories);
        setPriorites(listePriorites);
        setEquipes(listeEquipes);
      } catch (e) {
        setErreurChargement(messageErreur(e, 'Impossible de charger le formulaire.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, []);

  const onSubmit = async (data: FormulaireTicket) => {
    setErreur(null);
    try {
      const description = data.description.trim();
      const ticket = await creerTicket({
        sujet: data.sujet.trim(),
        description: description === '' ? undefined : description,
        equipe_id: Number(data.equipe_id),
        priorite_id: Number(data.priorite_id),
        categorie_id: Number(data.categorie_id),
      });
      onSucces(ticket);
    } catch (e) {
      setErreur(messageErreur(e, 'Impossible de créer le ticket.'));
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Chargement...</p>;
  }

  if (erreurChargement) {
    return (
      <div className="space-y-4">
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreurChargement}</p>
        <button
          type="button"
          onClick={onAnnuler}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Fermer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <p className="text-sm text-slate-500">Le délai SLA est calculé selon la priorité choisie.</p>

      <div>
        <label htmlFor="sujet" className={classeLabel}>
          Sujet
        </label>
        <input
          id="sujet"
          type="text"
          placeholder="Résumez le problème en une phrase"
          className={classeChamp}
          {...register('sujet', {
            required: 'Le sujet est obligatoire',
            maxLength: { value: 200, message: 'Le sujet ne doit pas dépasser 200 caractères' },
          })}
        />
        {errors.sujet && <p className="mt-1 text-sm text-red-600">{errors.sujet.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="categorie_id" className={classeLabel}>
            Catégorie
          </label>
          <select
            id="categorie_id"
            className={classeChamp}
            {...register('categorie_id', { required: 'La catégorie est obligatoire' })}
          >
            <option value="">Choisir…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
          {errors.categorie_id && (
            <p className="mt-1 text-sm text-red-600">{errors.categorie_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="priorite_id" className={classeLabel}>
            Priorité
          </label>
          <select
            id="priorite_id"
            className={classeChamp}
            {...register('priorite_id', { required: 'La priorité est obligatoire' })}
          >
            <option value="">Choisir…</option>
            {priorites.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom}
              </option>
            ))}
          </select>
          {errors.priorite_id && (
            <p className="mt-1 text-sm text-red-600">{errors.priorite_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="equipe_id" className={classeLabel}>
            Équipe
          </label>
          <select
            id="equipe_id"
            className={classeChamp}
            {...register('equipe_id', { required: "L'équipe est obligatoire" })}
          >
            <option value="">Choisir…</option>
            {equipes.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.nom}
              </option>
            ))}
          </select>
          {errors.equipe_id && (
            <p className="mt-1 text-sm text-red-600">{errors.equipe_id.message}</p>
          )}
        </div>

        <div>
          <span className={classeLabel}>Demandeur</span>
          <div className={`${classeChamp} bg-slate-50 text-slate-600`}>
            {user ? nomComplet(user.prenom, user.nom) : ''}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="description" className={classeLabel}>
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          placeholder="Décrivez le problème : que s'est-il passé, depuis quand, qui est concerné ?"
          className={classeChamp}
          {...register('description')}
        />
      </div>

      {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Création...' : 'Créer le ticket'}
        </button>
        <button
          type="button"
          onClick={onAnnuler}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}