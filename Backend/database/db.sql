CREATE DATABASE IF NOT EXISTS helpdesk_db CHARACTER SET utf8mb4;

USE helpdesk_db;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS equipe (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_equipe_nom UNIQUE (nom)
);

CREATE TABLE IF NOT EXISTS utilisateur (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    mdp VARCHAR(255) NOT NULL,
    role ENUM ('admin', 'technicien', 'demandeur') NOT NULL DEFAULT 'demandeur',
    equipe_id INT UNSIGNED DEFAULT NULL,
    statut ENUM ('actif', 'absent', 'inactif') NOT NULL DEFAULT 'actif',
    derniere_activite DATETIME DEFAULT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_utilisateur_email UNIQUE (email),
    CONSTRAINT fk_utilisateur_equipe FOREIGN KEY (equipe_id) REFERENCES equipe(id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX idx_utilisateur_role ON utilisateur(role);
CREATE INDEX idx_utilisateur_equipe ON utilisateur(equipe_id);

CREATE TABLE IF NOT EXISTS priorite (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    niveau_ordre TINYINT UNSIGNED NOT NULL COMMENT '1=urgente ... 4=Basse',
    couleur VARCHAR(20) DEFAULT NULL,

    CONSTRAINT uq_priorite_nom UNIQUE (nom)
);

CREATE TABLE IF NOT EXISTS statut (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    ordre TINYINT UNSIGNED NOT NULL,
    est_final BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT uq_statut_nom UNIQUE (nom)
);

CREATE TABLE IF NOT EXISTS sla (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    priorite_id INT UNSIGNED NOT NULL,
    equipe_id INT UNSIGNED DEFAULT NULL,
    delai_premiere_reponse_min INT UNSIGNED NOT NULL,
    delai_resolution_min INT UNSIGNED NOT NULL,

    CONSTRAINT fk_sla_priorite FOREIGN KEY (priorite_id) REFERENCES priorite(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sla_equipe FOREIGN KEY (equipe_id) REFERENCES equipe(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_sla_priorite_equipe UNIQUE (priorite_id, equipe_id)
);

CREATE TABLE IF NOT EXISTS ticket (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(20) NOT NULL,
    sujet VARCHAR(200) NOT NULL,
    description TEXT,
    demandeur_id INT UNSIGNED NOT NULL,
    technicien_id INT UNSIGNED DEFAULT NULL,
    equipe_id INT UNSIGNED NOT NULL,
    priorite_id INT UNSIGNED NOT NULL,
    statut_id INT UNSIGNED NOT NULL,
    sla_id INT UNSIGNED DEFAULT NULL,
    date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_limite_reponse DATETIME,
    date_limite_resolution DATETIME,
    date_premiere_reponse DATETIME,
    date_resolution DATETIME,
    reouvert BOOLEAN NOT NULL DEFAULT FALSE,
    nb_reouvertures INT UNSIGNED NOT NULL DEFAULT 0,

    CONSTRAINT uq_ticket_numero UNIQUE (numero),
    CONSTRAINT fk_ticket_demandeur FOREIGN KEY (demandeur_id) REFERENCES utilisateur(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ticket_technicien FOREIGN KEY (technicien_id) REFERENCES utilisateur(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_ticket_equipe FOREIGN KEY (equipe_id) REFERENCES equipe(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ticket_priorite FOREIGN KEY (priorite_id) REFERENCES priorite(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ticket_statut FOREIGN KEY (statut_id) REFERENCES statut(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ticket_sla FOREIGN KEY (sla_id) REFERENCES sla(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_ticket_statut ON ticket(statut_id);
CREATE INDEX idx_ticket_priorite ON ticket(priorite_id);
CREATE INDEX idx_ticket_equipe ON ticket(equipe_id);
CREATE INDEX idx_ticket_demandeur ON ticket(demandeur_id);
CREATE INDEX idx_ticket_technicien ON ticket(technicien_id);
CREATE INDEX idx_ticket_date_creation ON ticket(date_creation);

CREATE TABLE IF NOT EXISTS commentaire (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT UNSIGNED NOT NULL,
    utilisateur_id INT UNSIGNED NOT NULL,
    contenu TEXT NOT NULL,
    type ENUM ('public', 'interne') NOT NULL DEFAULT 'public',
    date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_commentaire_ticket FOREIGN KEY (ticket_id) REFERENCES ticket(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_commentaire_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_commentaire_ticket ON commentaire(ticket_id);

CREATE TABLE IF NOT EXISTS categorie (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,

    CONSTRAINT uq_categorie_nom UNIQUE(nom)
);

CREATE TABLE IF NOT EXISTS article (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    contenu LONGTEXT NOT NULL,
    categorie_id INT UNSIGNED NOT NULL,
    auteur_id INT UNSIGNED NOT NULL,
    statut ENUM ('publie', 'brouillon') NOT NULL DEFAULT 'brouillon',
    nb_vues INT UNSIGNED NOT NULL DEFAULT 0,
    taux_utilite DECIMAL(5,2),
    date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_maj DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_article_categorie FOREIGN KEY (categorie_id) REFERENCES categorie(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_article_auteur FOREIGN KEY (auteur_id) REFERENCES utilisateur(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_article_categorie ON article(categorie_id);
CREATE INDEX idx_article_statut ON article(statut);

SET FOREIGN_KEY_CHECKS = 1;