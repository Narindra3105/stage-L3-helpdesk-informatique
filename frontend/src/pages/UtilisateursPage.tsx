import { useEffect, useMemo, useState } from 'react';
import { getEquipes } from '../api/referentielService';
import { getUtilisateurs, supprimerUtilisateur } from '../api/utilisateurService';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ReinitialiserMdpForm from '../components/utilisateurs/ReinitialiserMdpForm';
import UtilisateurForm from '../components/utilisateurs/UtilisateurForm';
import { useAuth } from '../hooks/useAuth';
import { formatDateHeure } from '../utils/date';
import { messageErreur } from '../utils/erreurs';
import { initiales, nomComplet } from '../utils/format';
import { libellesRole } from '../utils/roles';
import { classeChamp } from '../utils/styles';
import {
  couleursRole,
  infosStatutUtilisateur,
  listeRoles,
  listeStatutsUtilisateur,
} from '../utils/utilisateurs';
import type { Equipe } from '../types/referentiel';
import type { Utilisateur } from '../types/user';

type EtatModal =
  | { mode: 'creation' }
  | { mode: 'edition'; utilisateur: Utilisateur }
  | { mode: 'mdp'; utilisateur: Utilisateur }
  | null;

const titreModal = (etat: Exclude<EtatModal, null>): string => {
  switch (etat.mode) {
    case 'creation':
      return 'Ajouter un utilisateur';
    case 'edition':
      return "Modifier l'utilisateur";
    case 'mdp':
      return 'Réinitialiser le mot de passe';
  }
};

export default function UtilisateursPage() {
  const { user } = useAuth();

  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurAction, setErreurAction] = useState<string | null>(null);
  const [modal, setModal] = useState<EtatModal>(null);
  const [rechargement, setRechargement] = useState<number>(0);

  const [recherche, setRecherche] = useState<string>('');
  const [roleFiltre, setRoleFiltre] = useState<string>('');
  const [statutFiltre, setStatutFiltre] = useState<string>('');

  useEffect(() => {
    const charger = async () => {
      try {
        const [listeUtilisateurs, listeEquipes] = await Promise.all([
          getUtilisateurs(),
          getEquipes(),
        ]);
        setUtilisateurs(listeUtilisateurs);
        setEquipes(listeEquipes);
      } catch (e) {
        setErreur(messageErreur(e, 'Impossible de charger les utilisateurs.'));
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, [rechargement]);

  const equipeParId = new Map(equipes.map((e) => [e.id, e.nom]));

  const utilisateursFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return [...utilisateurs]
      .sort((a, b) => a.nom.localeCompare(b.nom))
      .filter((u) => {
        if (terme) {
          const texte = `${u.prenom ?? ''} ${u.nom} ${u.email}`.toLowerCase();
          if (!texte.includes(terme)) {
            return false;
          }
        }
        if (roleFiltre && u.role !== roleFiltre) {
          return false;
        }
        if (statutFiltre && u.statut !== statutFiltre) {
          return false;
        }
        return true;
      });
  }, [utilisateurs, recherche, roleFiltre, statutFiltre]);

  const fermer = () => setModal(null);

  const apresEnregistrement = () => {
    setModal(null);
    setRechargement((n) => n + 1);
  };

  const supprimer = async (cible: Utilisateur) => {
    const confirme = window.confirm(
      `Supprimer ${nomComplet(cible.prenom, cible.nom)} ? Si cet utilisateur a des tickets, des commentaires ou des articles, la suppression sera refusée : passez-le plutôt en « Inactif ».`
    );
    if (!confirme) {
      return;
    }

    setErreurAction(null);
    try {
      await supprimerUtilisateur(cible.id);
      setRechargement((n) => n + 1);
    } catch (e) {
      setErreurAction(messageErreur(e, "Impossible de supprimer l'utilisateur."));
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
          <p className="mt-1 text-sm text-slate-500">Comptes et rôles de l'application</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'creation' })}
          className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Ajouter un utilisateur
        </button>
      </div>

      {loading && <p className="mt-8 text-slate-500">Chargement...</p>}

      {erreur && (
        <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
      )}

      {!loading && !erreur && (
        <>
          <div className="mt-6 flex flex-wrap gap-3">
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher par nom ou e-mail"
              aria-label="Rechercher un utilisateur"
              className={`${classeChamp} mt-0 w-full sm:w-72`}
            />
            <select
              value={roleFiltre}
              onChange={(e) => setRoleFiltre(e.target.value)}
              aria-label="Filtrer par rôle"
              className={`${classeChamp} mt-0 w-auto`}
            >
              <option value="">Tous les rôles</option>
              {listeRoles.map((r) => (
                <option key={r} value={r}>
                  {libellesRole[r]}
                </option>
              ))}
            </select>
            <select
              value={statutFiltre}
              onChange={(e) => setStatutFiltre(e.target.value)}
              aria-label="Filtrer par statut"
              className={`${classeChamp} mt-0 w-auto`}
            >
              <option value="">Tous les statuts</option>
              {listeStatutsUtilisateur.map((s) => (
                <option key={s} value={s}>
                  {infosStatutUtilisateur[s].libelle}
                </option>
              ))}
            </select>
          </div>

          {erreurAction && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {erreurAction}
            </p>
          )}

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              {utilisateursFiltres.length} utilisateur{utilisateursFiltres.length > 1 ? 's' : ''}
            </p>

            {utilisateursFiltres.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">Aucun utilisateur ne correspond.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="pb-2 pr-4 font-medium">Utilisateur</th>
                      <th className="pb-2 pr-4 font-medium">Rôle</th>
                      <th className="pb-2 pr-4 font-medium">Équipe</th>
                      <th className="pb-2 pr-4 font-medium">Statut</th>
                      <th className="pb-2 pr-4 font-medium">Dernière activité</th>
                      <th className="pb-2 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {utilisateursFiltres.map((u) => {
                      const estMoi = user !== null && u.id === user.id;
                      const infosStatut = infosStatutUtilisateur[u.statut];
                      return (
                        <tr key={u.id} className="border-b border-slate-100 last:border-0">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <Avatar texte={initiales(u.prenom, u.nom)} />
                              <div className="min-w-0">
                                <p className="truncate font-medium text-slate-900">
                                  {nomComplet(u.prenom, u.nom)}
                                  {estMoi && (
                                    <span className="ml-2 text-xs font-normal text-slate-400">
                                      (vous)
                                    </span>
                                  )}
                                </p>
                                <p className="truncate text-xs text-slate-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge couleur={couleursRole[u.role]}>{libellesRole[u.role]}</Badge>
                          </td>
                          <td className="py-3 pr-4 text-slate-600">
                            {u.equipe_id !== null
                              ? (equipeParId.get(u.equipe_id) ?? `#${u.equipe_id}`)
                              : '—'}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge couleur={infosStatut.couleur}>{infosStatut.libelle}</Badge>
                          </td>
                          <td className="py-3 pr-4 text-slate-600">
                            {formatDateHeure(u.derniere_activite)}
                          </td>
                          <td className="whitespace-nowrap py-3 text-right">
                            <button
                              onClick={() => setModal({ mode: 'edition', utilisateur: u })}
                              className="mr-3 text-xs font-medium text-blue-700 hover:underline"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => setModal({ mode: 'mdp', utilisateur: u })}
                              className="mr-3 text-xs font-medium text-blue-700 hover:underline"
                            >
                              Mot de passe
                            </button>
                            {!estMoi && (
                              <button
                                onClick={() => supprimer(u)}
                                className="text-xs font-medium text-red-600 hover:underline"
                              >
                                Supprimer
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {modal && (
        <Modal titre={titreModal(modal)} onFermer={fermer}>
          {modal.mode === 'mdp' ? (
            <ReinitialiserMdpForm utilisateur={modal.utilisateur} onFermer={fermer} />
          ) : (
            <UtilisateurForm
              utilisateur={modal.mode === 'edition' ? modal.utilisateur : undefined}
              estMoi={modal.mode === 'edition' && user !== null && modal.utilisateur.id === user.id}
              equipes={equipes}
              onSucces={apresEnregistrement}
              onAnnuler={fermer}
            />
          )}
        </Modal>
      )}
    </div>
  );
}