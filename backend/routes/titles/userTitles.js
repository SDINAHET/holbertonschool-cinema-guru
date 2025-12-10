const express = require('express')
const router = express.Router()
const { Title, UserFavorites, UserWatchLater } = require('../../models/Title')
const User = require('../../models/User')
const UserActivity = require('../../models/UserActivity')
const { verifyToken } = require('../../utils/tokens')

/**
 * @swagger
 * tags:
 *   - name: User Titles
 *     description: User's favorite and watch-later lists
 */

/**
 * @swagger
 * /api/titles/favorite/:
 *   get:
 *     summary: Get user's favorite titles
 *     description: Retourne la liste des films ajoutés en favoris par l'utilisateur.
 *     tags: [User Titles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des films favoris de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Title'
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur serveur lors de la récupération des favoris.
 */
router.get('/favorite/', verifyToken, (req, res) => {
    User.findOne({ where: { id: req.userId }, include: { model: Title, as: "favorite" } }).then(user => {
        res.send(user.favorite)
    }).catch(err => res.status(500).send(err))
})

/**
 * @swagger
 * /api/titles/watchLater/:
 *   get:
 *     summary: Get user's watch-later list
 *     description: Liste des films que l'utilisateur souhaite regarder plus tard.
 *     tags: [User Titles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des films watch-later de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Title'
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur serveur lors de la récupération de la watch-later list.
 */
router.get('/watchLater/', verifyToken, (req, res) => {
    User.findOne({ where: { id: req.userId }, include: { model: Title, as: "watchLater" } }).then(user => {
        res.send(user.watchLater)
    }).catch(err => res.status(500).send(err))
})

/**
 * @swagger
 * /api/titles/favorite/{imdbId}:
 *   post:
 *     summary: Add movie to favorites
 *     description: Ajoute un film aux favoris de l'utilisateur connecté.
 *     tags: [User Titles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imdbId
 *         required: true
 *         schema:
 *           type: string
 *           example: tt0133093
 *         description: Identifiant IMDb du film à ajouter en favoris.
 *     responses:
 *       200:
 *         description: Film ajouté aux favoris, liste mise à jour retournée.
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur serveur lors de l'ajout aux favoris.
 */
router.post('/favorite/:imdbId', verifyToken, (req, res) => {
    const { imdbId } = req.params
    User.findOne({ where: { id: req.userId }, include: { model: Title, as: "favorite" } }).then(user => {
        Title.findOne({ where: { imdbId } }).then(async title => {
            await user.addFavorite(title, { as: "favorite" })
            await UserActivity.create({
                userId: user.id,
                TitleId: title.id,
                activityType: "favorite"
            })
            res.send(user.favorite)
        }).catch(err => res.status(500).send(err))
    }).catch(err => res.status(500).send(err))
})

/**
 * @swagger
 * /api/titles/watchlater/{imdbId}:
 *   post:
 *     summary: Add movie to watch-later list
 *     description: Ajoute un film à la liste "watch-later" de l'utilisateur.
 *     tags: [User Titles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imdbId
 *         required: true
 *         schema:
 *           type: string
 *           example: tt0133093
 *         description: Identifiant IMDb du film à ajouter à la watch-later list.
 *     responses:
 *       200:
 *         description: Film ajouté, liste mise à jour retournée.
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur serveur lors de l'ajout à la watch-later list.
 */
router.post('/watchlater/:imdbId', verifyToken, (req, res) => {
    const { imdbId } = req.params
    User.findOne({ where: { id: req.userId }, include: { model: Title, as: "watchLater" } }).then(user => {
        Title.findOne({ where: { imdbId } }).then(async title => {
            try {
                await user.addWatchLater(title, { as: "watchLater" })
                await UserActivity.create({
                    userId: user.id,
                    TitleId: title.id,
                    activityType: "watchLater"
                })
                res.send(user.watchLater)
            } catch (error) { res.status(500).send(error) }
        }).catch(err => res.status(500).send(err))
    }).catch(err => res.status(500).send(err))
})

/**
 * @swagger
 * /api/titles/favorite/{imdbId}:
 *   delete:
 *     summary: Remove movie from favorites
 *     description: Retire un film des favoris de l'utilisateur.
 *     tags: [User Titles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imdbId
 *         required: true
 *         schema:
 *           type: string
 *           example: tt0133093
 *         description: Identifiant IMDb du film à retirer des favoris.
 *     responses:
 *       200:
 *         description: Activité de suppression enregistrée et retournée.
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur serveur lors de la suppression des favoris.
 */
router.delete('/favorite/:imdbId', verifyToken, async (req, res) => {
    const { imdbId } = req.params
    try {
        const title = await Title.findOne({ where: { imdbId } })
        const user = await User.findOne({ where: { id: req.userId } })
        await (await UserFavorites.findOne({ where: { UserId: req.userId, TitleId: title.id } })).destroy()
        const userActivity = await UserActivity.create({
            userId: user.id,
            TitleId: title.id,
            activityType: "removeFavorited"
        })
        res.send(userActivity)
    } catch (error) { res.status(500).send(error) }
})

/**
 * @swagger
 * /api/titles/watchlater/{imdbId}:
 *   delete:
 *     summary: Remove movie from watch-later list
 *     description: Retire un film de la liste "watch-later" de l'utilisateur.
 *     tags: [User Titles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imdbId
 *         required: true
 *         schema:
 *           type: string
 *           example: tt0133093
 *         description: Identifiant IMDb du film à retirer de la watch-later list.
 *     responses:
 *       200:
 *         description: Activité de suppression enregistrée et retournée.
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur serveur lors de la suppression de la watch-later list.
 */
router.delete('/watchlater/:imdbId', verifyToken, async (req, res) => {
    const { imdbId } = req.params
    try {
        const title = await Title.findOne({ where: { imdbId } })
        const user = await User.findOne({ where: { id: req.userId } })
        await (await UserWatchLater.findOne({ where: { UserId: req.userId, TitleId: title.id } })).destroy()
        const userActivity = await UserActivity.create({
            userId: user.id,
            TitleId: title.id,
            activityType: "removeWatchLater"
        })
        res.send(userActivity)
    } catch (error) { res.status(500).send(error) }
})


module.exports = router
