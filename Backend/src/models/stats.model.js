const pool = require('../config/db');

const getResume = async () => {
  const [[resume]] = await pool.query(`
    SELECT
      COALESCE(SUM(s.est_final = 0), 0) AS tickets_ouverts,
      COALESCE(SUM(s.est_final = 0 AND t.date_limite_resolution < NOW()), 0) AS sla_depasse,
      COALESCE(SUM(s.est_final = 1 AND DATE(t.date_resolution) = CURDATE()), 0) AS resolus_aujourdhui
    FROM ticket t
    JOIN statut s ON s.id = t.statut_id
  `);

  const [[temps]] = await pool.query(`
    SELECT AVG(TIMESTAMPDIFF(MINUTE, t.date_creation, t.date_resolution)) AS temps_moyen_minutes
    FROM ticket t
    JOIN statut s ON s.id = t.statut_id
    WHERE s.est_final = 1
      AND t.date_resolution IS NOT NULL
      AND t.date_resolution >= NOW() - INTERVAL 30 DAY
  `);

  const [[sla]] = await pool.query(`
    SELECT
      COUNT(*) AS total,
      COALESCE(SUM(
        CASE
          WHEN s.est_final = 1 AND t.date_resolution IS NOT NULL
            THEN t.date_resolution <= t.date_limite_resolution
          ELSE NOW() <= t.date_limite_resolution
        END
      ), 0) AS dans_les_delais
    FROM ticket t
    JOIN statut s ON s.id = t.statut_id
    WHERE t.date_limite_resolution IS NOT NULL
      AND t.date_creation >= NOW() - INTERVAL 30 DAY
  `);

  const total = Number(sla.total);
  const dansLesDelais = Number(sla.dans_les_delais);

  return {
    tickets_ouverts: Number(resume.tickets_ouverts),
    sla_depasse: Number(resume.sla_depasse),
    resolus_aujourdhui: Number(resume.resolus_aujourdhui),
    temps_moyen_minutes:
      temps.temps_moyen_minutes === null ? null : Math.round(Number(temps.temps_moyen_minutes)),
    respect_sla: total === 0 ? null : Math.round((dansLesDelais / total) * 100),
  };
};

const getChargeTechniciens = async () => {
  const [rows] = await pool.query(`
    SELECT u.id, u.nom, u.prenom, COUNT(t.id) AS tickets_en_cours
    FROM utilisateur u
    LEFT JOIN ticket t
      ON t.technicien_id = u.id
      AND t.statut_id IN (SELECT id FROM statut WHERE est_final = 0)
    WHERE u.role = 'technicien' AND u.statut <> 'inactif'
    GROUP BY u.id, u.nom, u.prenom
    ORDER BY tickets_en_cours DESC, u.nom ASC
  `);
  return rows.map((r) => ({ ...r, tickets_en_cours: Number(r.tickets_en_cours) }));
};

const getDerniersTickets = async () => {
  const [rows] = await pool.query(`
    SELECT t.id, t.numero, t.sujet,
           p.nom AS priorite_nom,
           s.nom AS statut_nom,
           u.nom AS technicien_nom, u.prenom AS technicien_prenom
    FROM ticket t
    JOIN priorite p ON p.id = t.priorite_id
    JOIN statut s ON s.id = t.statut_id
    LEFT JOIN utilisateur u ON u.id = t.technicien_id
    ORDER BY t.date_creation DESC, t.id DESC
    LIMIT 5
  `);
  return rows;
};

const getDashboard = async () => {
  const [resume, chargeTechniciens, derniersTickets] = await Promise.all([
    getResume(),
    getChargeTechniciens(),
    getDerniersTickets(),
  ]);
  return {
    resume,
    charge_techniciens: chargeTechniciens,
    derniers_tickets: derniersTickets,
  };
};
const getTechniciens = async () => {
  const [rows] = await pool.query(`
    SELECT u.id, u.nom, u.prenom, u.email, u.statut, u.equipe_id,
           e.nom AS equipe_nom,
           COUNT(CASE WHEN s.est_final = 0 THEN 1 END) AS tickets_en_cours,
           COUNT(
             CASE WHEN s.est_final = 1
                   AND t.date_resolution >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
                  THEN 1 END
           ) AS resolus_ce_mois
    FROM utilisateur u
    LEFT JOIN equipe e ON e.id = u.equipe_id
    LEFT JOIN ticket t ON t.technicien_id = u.id
    LEFT JOIN statut s ON s.id = t.statut_id
    WHERE u.role = 'technicien'
    GROUP BY u.id, u.nom, u.prenom, u.email, u.statut, u.equipe_id, e.nom
    ORDER BY u.nom ASC, u.prenom ASC
  `);

  return rows.map((r) => ({
    ...r,
    tickets_en_cours: Number(r.tickets_en_cours),
    resolus_ce_mois: Number(r.resolus_ce_mois),
  }));
};

const SEMAINES = 6;
const DEBUT_PERIODE = `DATE_SUB(CURDATE(), INTERVAL ${SEMAINES * 7 - 1} DAY)`;

const DANS_LES_DELAIS = `
  CASE
    WHEN s.est_final = 1 AND t.date_resolution IS NOT NULL
      THEN t.date_resolution <= t.date_limite_resolution
    ELSE NOW() <= t.date_limite_resolution
  END
`;

const pourcentage = (partie, total) => {
  const sur = Number(total);
  return sur === 0 ? null : Math.round((Number(partie) / sur) * 100);
};

const getRapportSla = async () => {
  const [[resume]] = await pool.query(`
    SELECT COUNT(*) AS total_tickets,
           COUNT(t.date_limite_resolution) AS avec_sla,
           COALESCE(SUM(${DANS_LES_DELAIS}), 0) AS dans_les_delais,
           AVG(
             CASE WHEN s.est_final = 1 AND t.date_resolution IS NOT NULL
                  THEN TIMESTAMPDIFF(MINUTE, t.date_creation, t.date_resolution) END
           ) AS temps_moyen_minutes
    FROM ticket t
    JOIN statut s ON s.id = t.statut_id
    WHERE t.date_creation >= ${DEBUT_PERIODE}
  `);

  const [semaines] = await pool.query(`
    SELECT DATEDIFF(CURDATE(), DATE(t.date_creation)) DIV 7 AS semaine_index,
           COUNT(t.date_limite_resolution) AS avec_sla,
           COALESCE(SUM(${DANS_LES_DELAIS}), 0) AS dans_les_delais
    FROM ticket t
    JOIN statut s ON s.id = t.statut_id
    WHERE t.date_creation >= ${DEBUT_PERIODE}
    GROUP BY semaine_index
  `);

  const [priorites] = await pool.query(`
    SELECT p.id, p.nom, p.couleur,
           COUNT(t.id) AS tickets,
           COUNT(t.date_limite_resolution) AS avec_sla,
           COALESCE(SUM(${DANS_LES_DELAIS}), 0) AS dans_les_delais
    FROM priorite p
    LEFT JOIN ticket t ON t.priorite_id = p.id AND t.date_creation >= ${DEBUT_PERIODE}
    LEFT JOIN statut s ON s.id = t.statut_id
    GROUP BY p.id, p.nom, p.couleur, p.niveau_ordre
    ORDER BY p.niveau_ordre ASC
  `);

  const avecSla = Number(resume.avec_sla);
  const dansLesDelais = Number(resume.dans_les_delais);

  const parIndex = new Map(semaines.map((ligne) => [Number(ligne.semaine_index), ligne]));

  const parSemaine = Array.from({ length: SEMAINES }, (_, i) => {
    const ligne = parIndex.get(SEMAINES - 1 - i);
    const total = ligne ? Number(ligne.avec_sla) : 0;
    const dans = ligne ? Number(ligne.dans_les_delais) : 0;
    return {
      semaine: `S${i + 1}`,
      avec_sla: total,
      dans_les_delais: dans,
      respect_sla: pourcentage(dans, total),
    };
  });

  return {
    resume: {
      total_tickets: Number(resume.total_tickets),
      retards: avecSla - dansLesDelais,
      respect_sla: pourcentage(dansLesDelais, avecSla),
      temps_moyen_minutes:
        resume.temps_moyen_minutes === null ? null : Math.round(Number(resume.temps_moyen_minutes)),
    },
    par_semaine: parSemaine,
    par_priorite: priorites.map((p) => ({
      id: p.id,
      nom: p.nom,
      couleur: p.couleur,
      tickets: Number(p.tickets),
      avec_sla: Number(p.avec_sla),
      dans_les_delais: Number(p.dans_les_delais),
      respect_sla: pourcentage(p.dans_les_delais, p.avec_sla),
    })),
  };
};

module.exports = { getDashboard, getTechniciens, getRapportSla };