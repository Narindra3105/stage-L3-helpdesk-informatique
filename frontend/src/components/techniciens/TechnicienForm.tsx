import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { creerUtilisateur, modifierUtilisateur } from '../../api/utilisateurService';
import { erreursChamps, messageErreur } from '../../utils/erreurs';
import type { Equipe } from '../../types/referentiel';
import type { StatTechnicien } from '../../types/stats';
import type { StatutUtilisateur } from '../../types/user';

interface FormulaireTechnicien {
  nom: string;
  prenom: string;
  email: string;
  mdp: string;
  equipe_id: string;
  statut: StatutUtilisateur;
}

interface TechnicienFormProps {
  technicien?: StatTechnicien;
  equipes: Equipe[];
  onSucces: () => void;
  onAnnuler: () => void;
}

const champsConnus: string[] = ['nom', 'prenom', 'email', 'mdp', 'equipe_id', 'statut'];

const estChampConnu = (champ: string): champ is keyof FormulaireTechnicien => {
  return champsConnus.includes(champ);
};

const optionsStatut: { valeur: StatutUtilisateur; libelle: string }[] = [
  { valeur: 'actif', libelle: 'Actif' },
  { valeur: 'absent', libelle: 'Absent' },
  { valeur: 'inactif', libelle: 'Inactif' },
];

const classeChamp =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20';

const classeLabel = 'block text-sm font-medium text-slate-700';

export default function TechnicienForm({
  technicien,
  equipes,
  onSucces,
  onAnnuler,
}: TechnicienFormProps) {
  const edition = technicien !== undefined;
  const [erreur, setErreur] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormulaireTechnicien>({
    defaultValues: {
      nom: technicien ? technicien.nom : '',
      prenom: technicien && technicien.prenom ? technicien.prenom : '',
      email: technicien ? technicien.email : '',
      mdp: '',
      equipe_id: technicien && technicien.equipe_id !== null ? String(technicien.equipe_id) : '',
      statut: technicien ? technicien.statut : 'actif',
    },
  });

  const onSubmit = async (data: FormulaireTechnicien) => {
    setErreur(null);

    const prenom = data.prenom.trim();
    const commun = {
      nom: data.nom.trim(),
      prenom: prenom === '' ? null : prenom,
      email: data.email.trim(),
      role: 'technicien' as const,
      equipe_id: data.equipe_id === '' ? null : Number(data.equipe_id),
      statut: data.statut,
    };

    try {
      if (technicien) {
        await modifierUtilisateur(technicien.id, commun);
      } else {
        await creerUtilisateur({ ...commun, mdp: data.mdp });
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
            edition ? 'Impossible de modifier le technicien.' : 'Impossible de créer le technicien.'
          )
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
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
              maxLength: { value: 100, message: 'Le nom ne doit pas dépasser 100 caractères' },
            })}
          />
          {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>}
        </div>

        <div>
          <label htmlFor="prenom" className={classeLabel}>
            Prénom (facultatif)
          </label>
          <input
            id="prenom"
            type="text"
            className={classeChamp}
            {...register('prenom', {
              maxLength: { value: 100, message: 'Le prénom ne doit pas dépasser 100 caractères' },
            })}
          />
          {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className={classeLabel}>
          Adresse e-mail
        </label>
        <input
          id="email"
          type="email"
          className={classeChamp}
          {...register('email', {
            required: "L'adresse e-mail est obligatoire",
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Adresse e-mail invalide' },
            maxLength: { value: 150, message: "L'e-mail ne doit pas dépasser 150 caractères" },
          })}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {!edition && (
        <div>
          <label htmlFor="mdp" className={classeLabel}>
            Mot de passe
          </label>
          <input
            id="mdp"
            type="password"
            autoComplete="new-password"
            className={classeChamp}
            {...register('mdp', {
              required: 'Le mot de passe est obligatoire',
              minLength: { value: 8, message: 'Au moins 8 caractères' },
              maxLength: { value: 72, message: 'Au plus 72 caractères' },
            })}
          />
          {errors.mdp && <p className="mt-1 text-sm text-red-600">{errors.mdp.message}</p>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="equipe_id" className={classeLabel}>
            Équipe
          </label>
          <select id="equipe_id" className={classeChamp} {...register('equipe_id')}>
            <option value="">Aucune équipe</option>
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
          <label htmlFor="statut" className={classeLabel}>
            Statut
          </label>
          <select id="statut" className={classeChamp} {...register('statut')}>
            {optionsStatut.map((o) => (
              <option key={o.valeur} value={o.valeur}>
                {o.libelle}
              </option>
            ))}
          </select>
          {errors.statut && <p className="mt-1 text-sm text-red-600">{errors.statut.message}</p>}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Un technicien absent ne peut plus recevoir de ticket. Un technicien inactif ne peut plus se
        connecter.
      </p>

      {erreur && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erreur}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Enregistrement...' : edition ? 'Enregistrer' : 'Créer le technicien'}
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