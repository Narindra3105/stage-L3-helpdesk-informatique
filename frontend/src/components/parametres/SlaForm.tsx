import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { creerSla, modifierSla } from '../../api/slaService';
import { decomposerDelai, versMinutes } from '../../utils/delais';
import type { UniteDelai } from '../../utils/delais';
import { erreursChamps, messageErreur } from '../../utils/erreurs';
import type { Equipe, Priorite } from '../../types/referentiel';
import type { Sla, SlaPayload } from '../../types/sla';

interface FormulaireSla {
  priorite_id: string;
  equipe_id: string;
  reponse_valeur: string;
  reponse_unite: UniteDelai;
  resolution_valeur: string;
  resolution_unite: UniteDelai;
}

interface SlaFormProps {
  sla?: Sla;
  priorites: Priorite[];
  equipes: Equipe[];
  onSucces: () => void;
  onAnnuler: () => void;
}

const correspondance: Record<string, keyof FormulaireSla | undefined> = {
  priorite_id: 'priorite_id',
  equipe_id: 'equipe_id',
  delai_premiere_reponse_min: 'reponse_valeur',
  delai_resolution_min: 'resolution_valeur',
};

const optionsUnite: { valeur: UniteDelai; libelle: string }[] = [
  { valeur: 'min', libelle: 'Minutes' },
  { valeur: 'h', libelle: 'Heures' },
  { valeur: 'j', libelle: 'Jours' },
];

const delaiValide = (texte: string): true | string => {
  const nombre = Number(texte);
  return (Number.isInteger(nombre) && nombre >= 1) || 'Saisissez un nombre entier supérieur à 0';
};

const classeChamp =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20';

const classeLabel = 'block text-sm font-medium text-slate-700';

export default function SlaForm({ sla, priorites, equipes, onSucces, onAnnuler }: SlaFormProps) {
  const edition = sla !== undefined;
  const [erreur, setErreur] = useState<string | null>(null);

  const reponse = sla ? decomposerDelai(sla.delai_premiere_reponse_min) : null;
  const resolution = sla ? decomposerDelai(sla.delai_resolution_min) : null;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormulaireSla>({
    defaultValues: {
      priorite_id: sla ? String(sla.priorite_id) : '',
      equipe_id: sla && sla.equipe_id !== null ? String(sla.equipe_id) : '',
      reponse_valeur: reponse ? String(reponse.valeur) : '',
      reponse_unite: reponse ? reponse.unite : 'min',
      resolution_valeur: resolution ? String(resolution.valeur) : '',
      resolution_unite: resolution ? resolution.unite : 'h',
    },
  });

  const onSubmit = async (data: FormulaireSla) => {
    setErreur(null);

    const priorite = priorites.find((p) => p.id === Number(data.priorite_id));
    const equipe =
      data.equipe_id === '' ? undefined : equipes.find((e) => e.id === Number(data.equipe_id));

    const nom = `SLA ${priorite ? priorite.nom : ''}${equipe ? ` - ${equipe.nom}` : ''}`
      .trim()
      .slice(0, 100);

    const payload: SlaPayload = {
      nom,
      priorite_id: Number(data.priorite_id),
      equipe_id: data.equipe_id === '' ? null : Number(data.equipe_id),
      delai_premiere_reponse_min: versMinutes(Number(data.reponse_valeur), data.reponse_unite),
      delai_resolution_min: versMinutes(Number(data.resolution_valeur), data.resolution_unite),
    };

    try {
      if (sla) {
        await modifierSla(sla.id, payload);
      } else {
        await creerSla(payload);
      }
      onSucces();
    } catch (e) {
      let champAssocie = false;
      for (const { champ, message } of erreursChamps(e)) {
        const champFormulaire = correspondance[champ];
        if (champFormulaire) {
          setError(champFormulaire, { message });
          champAssocie = true;
        }
      }
      if (!champAssocie) {
        setErreur(
          messageErreur(
            e,
            edition ? 'Impossible de modifier la règle.' : 'Impossible de créer la règle.'
          )
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
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
          <select id="equipe_id" className={classeChamp} {...register('equipe_id')}>
            <option value="">Toutes les équipes</option>
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
      </div>

      <div>
        <label htmlFor="reponse_valeur" className={classeLabel}>
          Prise en charge (première réponse)
        </label>
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <input
            id="reponse_valeur"
            type="number"
            min={1}
            className={classeChamp}
            {...register('reponse_valeur', {
              required: 'Le délai est obligatoire',
              validate: delaiValide,
            })}
          />
          <select aria-label="Unité" className={classeChamp} {...register('reponse_unite')}>
            {optionsUnite.map((o) => (
              <option key={o.valeur} value={o.valeur}>
                {o.libelle}
              </option>
            ))}
          </select>
        </div>
        {errors.reponse_valeur && (
          <p className="mt-1 text-sm text-red-600">{errors.reponse_valeur.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="resolution_valeur" className={classeLabel}>
          Résolution
        </label>
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <input
            id="resolution_valeur"
            type="number"
            min={1}
            className={classeChamp}
            {...register('resolution_valeur', {
              required: 'Le délai est obligatoire',
              validate: {
                entier: delaiValide,
                coherent: (valeur, valeurs) => {
                  const priseEnCharge = versMinutes(
                    Number(valeurs.reponse_valeur),
                    valeurs.reponse_unite
                  );
                  if (Number.isNaN(priseEnCharge)) {
                    return true;
                  }
                  return (
                    versMinutes(Number(valeur), valeurs.resolution_unite) >= priseEnCharge ||
                    'La résolution doit durer au moins aussi longtemps que la prise en charge'
                  );
                },
              },
            })}
          />
          <select aria-label="Unité" className={classeChamp} {...register('resolution_unite')}>
            {optionsUnite.map((o) => (
              <option key={o.valeur} value={o.valeur}>
                {o.libelle}
              </option>
            ))}
          </select>
        </div>
        {errors.resolution_valeur && (
          <p className="mt-1 text-sm text-red-600">{errors.resolution_valeur.message}</p>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Une règle « Toutes les équipes » s'applique quand aucune règle propre à l'équipe du ticket
        n'existe pour cette priorité.
      </p>

      {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Enregistrement...' : edition ? 'Enregistrer' : 'Créer la règle'}
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