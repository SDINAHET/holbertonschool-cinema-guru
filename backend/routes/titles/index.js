const express = require('express')
const router = express.Router()
const { Title } = require('../../models/Title')
const { verifyToken } = require('../../utils/tokens')
const { Op } = require('@sequelize/core');
const userTitlesRouter = require('./userTitles')
const axios = require('axios')

/**
 * @swagger
 * tags:
 *   - name: Titles
 *     description: Movies catalog and advanced search
 */
router.use('/', userTitlesRouter)

/**
 * @swagger
 * /api/titles/advancedsearch:
 *   get:
 *     summary: Advanced movie search
 *     description: |
 *       Recherche avancée de films par titre, genres, année de sortie et tri.
 *       Les résultats sont paginés par blocs de 50 éléments.
 *     tags: [Titles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filtre sur le titre du film (recherche partielle, insensible à la casse).
 *       - in: query
 *         name: genres
 *         schema:
 *           type: string
 *         description: |
 *           Liste de genres séparés par des virgules (ex: `Action,Comedy`).
 *           Chaque genre est mis en forme (première lettre en majuscule).
 *       - in: query
 *         name: minYear
 *         schema:
 *           type: integer
 *           example: 1990
 *         description: Année minimale de sortie (incluse).
 *       - in: query
 *         name: maxYear
 *         schema:
 *           type: integer
 *           example: 2022
 *         description: Année maximale de sortie (incluse).
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [oldest, highestrated, lowestrated]
 *         description: |
 *           Critère de tri :
 *           - `oldest` : du plus ancien au plus récent
 *           - `highestrated` : meilleure note IMDb en premier
 *           - `lowestrated` : plus faible note IMDb en premier
 *           - vide (défaut) : du plus récent au plus ancien
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Numéro de page. Chaque page ajoute 50 éléments au résultat.
 *     responses:
 *       200:
 *         description: Liste de films correspondant aux filtres.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   example: 120
 *                 titles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Title'
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur serveur lors de la recherche.
 */
router.get('/advancedsearch', verifyToken, async (req, res) => {
    const maxYear = parseInt(req.query.maxYear)
    const minYear = parseInt(req.query.maxYear)
    const genre = req.query.genres ? req.query.genres.split(',').map(genre => genre.charAt(0).toUpperCase() + genre.slice(1)) : []
    const params = {
        maxYear: isNaN(maxYear) ? 2022 : maxYear,
        minYear: isNaN(minYear) ? 0 : minYear,
        sort: req.query.sort ?? "",
        genres: genre,
        title: req.query.title ? req.query.title : "",
        page: req.query.page ? req.query.page : 1,
    }
    const titles = await Title.findAll({
        where: {
            released: {
                [Op.between]: [params.minYear, params.maxYear]
            },
            genres: {
                [Op.contains]: params.genres ? params.genres : true
            },
            title: {
                [Op.iLike]: `%${params.title}%`
            }
        },
        order: [getSort(params.sort)],
        limit: params.page * 50,
    }).catch(err => res.status(500).send(err))
    res.send({ totalCount: titles.length, titles })
})

/**
 * @swagger
 * /api/titles/{imdbId}:
 *   get:
 *     summary: Get movie details by IMDb ID
 *     description: Retourne les informations détaillées d'un film à partir de son `imdbId`.
 *     tags: [Titles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imdbId
 *         required: true
 *         schema:
 *           type: string
 *           example: tt0133093
 *         description: Identifiant IMDb du film.
 *     responses:
 *       200:
 *         description: Film trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Title'
 *       404:
 *         description: Film non trouvé.
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur serveur lors de la récupération du film.
 */
router.get('/:imdbId', verifyToken, (req, res) => {
    const { imdbId } = req.params
    Title.findOne({ where: { imdbId } }).then(data => res.send(data)).catch(err => res.status(500).send(err))
})

const getSort = (param) => {
    switch (param) {
        case "oldest":
            return ['released', 'ASC']
        case "highestrated":
            return ['imdbrating', 'DESC']
        case "lowestrated":
            return ['imdbrating', 'ASC']
        default:
            return ['released', 'DESC']
    }
}

module.exports = router
