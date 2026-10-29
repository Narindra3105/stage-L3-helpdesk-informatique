import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { creerStatut, modifierStatut } from '../../api/referentielService';
import { erreursChamps, messageErreur } from '../../utils/erreurs';
import { classeChamp, classeLabel } from '../../utils/styles';
import type { Statut, StatutPayload } from '../../types/referentiel';

interface FormulaireStatut {
  nom: string;
  ordre: string;
  est_final: boolean;
}

interface StatutFormProps {
  statut?: Statut;
  ordreSuggere: number;
  onSucces: () => void;
  onAnnuler: () => void;
}

const champsConnus: string[] = ['nom', 'ordre', 'est_final'];

const estChampConnu = (champ: string): champ is keyof FormulaireStatut => {
  return champsConnus.includes(champ);
};

const ordreValide = (texte: string): true | string => {
  const nombre = Number(texte);
  return (
    (Number.isInteger(nombre) && nombre >= 1 && nombre <= 255) ||
    'Saisissez un nombre entier entre 1 et 255'
  );
};

export default function StatutForm({ statut, ordreSuggere, onSucces, onAnnuler }: StatutFormProps) {
  const edition = statut !== undefined;
  const [erreur, setErreur] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormulaireStatut>({
    defaultValues: {
      nom: statut ? statut.nom : '',
      ordre: statut ? String(statut.ordre) : String(ordreSuggere),
      est_final: statut ? Boolean(statut.est_final) : false,
    },
  });

  const onSubmit = async (data: FormulaireStatut) => {
    setErreur(null);

    const payload: StatutPayload = {
      nom: data.nom.trim(),
      ordre: Number(data.ordre),
      est_final: data.est_final,
    };

    try {
      if (statut) {
        await modifierStatut(statut.id, payload);
      } else {
        await creerStatut(payload);
      }
      onSucces();
    } catch (e) {
      let champAssocie = false;
      for (const { champ, message } of erreursChamps(e)) {
        if (estChampConnu(champ)) {
          setError(champ, { message });
          champAssocie = true;
        }
      }
      if (!champAssocie) {
        setErreur(
          messageErreur(
            e,
            edition ? 'Impossible de modifier le statut.' : 'Impossible de créer le statut.'
          )
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="nom" className={classeLabel}>
          Nom
        </label>
        <input
          id="nom"
          type="text"
          className={classeChamp}
          {...register('nom', {
            required: 'Le nom est obligatoire',
            maxLength: { value: 50, message: 'Le nom ne doit pas dépasser 50 caractères' },
          })}
        />
        {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>}
      </div>

      <div>
        <label htmlFor="ordre" className={classeLabel}>
          Ordre
        </label>
        <input
          id="ordre"
          type="number"
          min={1}
          max={255}
          className={classeChamp}
          {...register('ordre', {
            required: "L'ordre est obligatoire",
            validate: ordreValide,
          })}
        />
        {errors.ordre && <p className="mt-1 text-sm text-red-600">{errors.ordre.message}</p>}
      </div>

      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input type="checkbox" className="mt-0.5" {...register('est_final')} />
        <span>
          Statut final
          <span className="block text-xs text-slate-500">
            Un ticket dans ce statut est considéré comme terminé (date de résolution enregistrée).
          </span>
        </span>
      </label>

      <p className="text-xs text-slate-500">
        L'ordre définit la position de la colonne dans le tableau des tickets. Le statut dont
        l'ordre est le plus bas est attribué aux nouveaux tickets.
      </p>

      {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Enregistrement...' : edition ? 'Enregistrer' : 'Créer le statut'}
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