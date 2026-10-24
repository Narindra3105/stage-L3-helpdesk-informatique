const articleModel = require('../models/article.model');
const AppError = require('../utils/AppError');
const handleDbError = require('../utils/handleDbError');

const MESSAGES_DB = {
    missing: {
        fk_article_categorie: "La catégorie indiquée n'existe pas",
    },
};

exports.getAll = async (req, res) => {
    const articles = await articleModel.findAll({
        publieOnly: req.user.role === 'demandeur',
        categorieId: req.query.categorie_id ? Number(req.query.categorie_id) : undefined,
    });
    res.json(articles);
};

exports.getOne = async (req, res) => {
    const article = await articleModel.findById(req.params.id);
    if (!article) {
        throw new AppError('Article introuvable', 404);
    }

    if (req.user.role === 'demandeur' && article.statut !== 'publie') {
        throw new AppError('Article introuvable', 404);
    }

    if (article.statut === 'publie' && article.auteur_id !== req.user.id) {
        await articleModel.incrementerVues(article.id);
        article.nb_vues += 1; 
    }

    res.json(article);
};

exports.create = async (req, res) => {
    const { titre, contenu, categorie_id, statut } = req.body;

    try {
        const article = await articleModel.create({
            titre,
            contenu,
            categorie_id,
            auteur_id: req.user.id,
            statut,
        });
        res.status(201).json(article);
    } catch (err) {
        handleDbError(err, MESSAGES_DB);
    }
};

exports.update = async (req, res) => {
    const existant = await articleModel.findById(req.params.id);
    if (!existant) {
        throw new AppError('Article introuvable', 404);
    }

    if (existant.auteur_id !== req.user.id && req.user.role !== 'admin') {
        throw new AppError('Vous ne pouvez modifier que vos propres articles', 403);
    }

    const { titre, contenu, categorie_id, statut } = req.body;

    try {
        const article = await articleModel.update(req.params.id, {
            titre,
            contenu,
            categorie_id,
            statut: statut ?? existant.statut,
        });
        res.json(article);
    } catch (err) {
        handleDbError(err, MESSAGES_DB);
    }
};

exports.remove = async (req, res) => {
    const existant = await articleModel.findById(req.params.id);
    if (!existant) {
        throw new AppError('Article introuvable', 404);
    }

    if (existant.auteur_id !== req.user.id && req.user.role !== 'admin') {
        throw new AppError('Vous ne pouvez supprimer que vos propres articles', 403);
    }

    await articleModel.remove(req.params.id);
    res.status(204).send();
};