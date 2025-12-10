const express = require('express')
const router = express.Router()
const { Title, UserFavorites, UserWatchLater } = require('../../models/Title')
const User = require('../../models/User')
const UserActivity = require('../../models/UserActivity')
const { verifyToken } = require('../../utils/tokens')

/**
 * @swagger
 * /api/titles/favorite:
 *   get:
 *     summary: Get user's favorite titles
 *     tags: [User Titles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite titles
 */
router.get('/favorite/', verifyToken, (req, res) => {
    User.findOne({ where: { id: req.userId }, include: { model: Title, as: "favorite" } }).then(user => {
        res.send(user.favorite)
    }).catch(err => res.status(500).send(err))
})

/**
 * @swagger
 * /api/titles/watchLater:
 *   get:
 *     summary: Get user's watch-later list
 *     tags: [User Titles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of watch-later items
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
 *     tags: [User Titles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imdbId
 *         required: true
 *     responses:
 *       200:
 *         description: Favorite list updated
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
 *     summary: Add to watch-later list
 *     tags: [User Titles]
 *     security:
 *       - BearerAuth: []
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
 *     summary: Remove from favorites
 *     tags: [User Titles]
 *     security:
 *       - BearerAuth: []
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
 *     summary: Remove from watch-later list
 *     tags: [User Titles]
 *     security:
 *       - BearerAuth: []
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
