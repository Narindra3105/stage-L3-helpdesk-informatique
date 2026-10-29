import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { creerPriorite, modifierPriorite } from '../../api/referentielService';
import PriorityBadge from '../tickets/PriorityBadge';
import { erreursChamps, messageErreur } from '../../utils/erreurs';
import { classeChamp, classeLabel } from '../../utils/styles';
import type { Priorite, PrioritePayload } from '../../types/referentiel';

interface FormulairePriorite {
  nom: string;
  niveau_ordre: string;
  couleur: string;
}

interface PrioriteFormProps {
  priorite?: Priorite;
  niveauSuggere: number;
  onSucces: () => void;
  onAnnuler: () => void;
}

const COULEUR_PAR_DEFAUT = '#2563EB';
const FORMAT_COULEUR = /^#[0-9a-fA-F]{6}$/;

const champsConnus: string[] = ['nom', 'niveau_ordre', 'couleur'];

const estChampConnu = (champ: string): champ is keyof FormulairePriorite => {
  return champsConnus.includes(champ);
};

const niveauValide = (texte: string): true | string => {
  const nombre = Number(texte);
  return (
    (Number.isInteger(nombre) && nombre >= 1 && nombre <= 255) ||
    'Saisissez un nombre entier entre 1 et 255'
  );
};

export default function PrioriteForm({
  priorite,
  niveauSuggere,
  onSucces,
  onAnnuler,
}: PrioriteFormProps) {
  const edition = priorite !== undefined;
  const [erreur, setErreur] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormulairePriorite>({
    defaultValues: {
      nom: priorite ? priorite.nom : '',
      niveau_ordre: priorite ? String(priorite.niveau_ordre) : String(niveauSuggere),
      couleur:
        priorite && priorite.couleur && FORMAT_COULEUR.test(priorite.couleur)
          ? priorite.couleur
          : COULEUR_PAR_DEFAUT,
    },
  });

  const nomSaisi = useWatch({ control, name: 'nom' });
  const couleurChoisie = useWatch({ control, name: 'couleur' });

  const onSubmit = async (data: FormulairePriorite) => {
    setErreur(null);

    const payload: PrioritePayload = {
      nom: data.nom.trim(),
      niveau_ordre: Number(data.niveau_ordre),
      couleur: data.couleur,
    };

    try {
      if (priorite) {
        await modifierPriorite(priorite.id, payload);
      } else {
        await creerPriorite(payload);
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
            edition ? 'Impossible de modifier la priorité.' : 'Impossible de créer la priorité.'
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="niveau_ordre" className={classeLabel}>
            Niveau
          </label>
          <input
            id="niveau_ordre"
            type="number"
            min={1}
            max={255}
            className={classeChamp}
            {...register('niveau_ordre', {
              required: 'Le niveau est obligatoire',
              validate: niveauValide,
            })}
          />
          {errors.niveau_ordre && (
            <p className="mt-1 text-sm text-red-600">{errors.niveau_ordre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="couleur" className={classeLabel}>
            Couleur
          </label>
          <input
            id="couleur"
            type="color"
            className="mt-1 h-10 w-24 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
            {...register('couleur')}
          />
          {errors.couleur && <p className="mt-1 text-sm text-red-600">{errors.couleur.message}</p>}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Le niveau 1 est la priorité la plus urgente : il sert à trier les priorités.
      </p>

      <div>
        <p className={classeLabel}>Aperçu</p>
        <div className="mt-2">
          <PriorityBadge nom={nomSaisi.trim() || 'Priorité'} couleur={couleurChoisie} />
        </div>
      </div>

      {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Enregistrement...' : edition ? 'Enregistrer' : 'Créer la priorité'}
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