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

module.exports = { getDashboard };