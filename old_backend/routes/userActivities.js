const express = require('express')
const router = express.Router()
const UserActivity = require('../models/UserActivity')
const User = require('../models/User')
const { Title } = require('../models/Title')
const { verifyToken } = require('../utils/tokens')

/**
 * @swagger
 * /api/activity:
 *   get:
 *     summary: Get all user activity logs
 *     description: Includes favorites, watch later, and removed items.
 *     tags: [User Activity]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Activity list returned
 */
router.get('/', verifyToken, (req, res) => {
    UserActivity.findAll({
        include: [{
            model: User, as: "user", attributes: ["username"]
        },
        {
            model: Title, as: "title", attributes: ["title"]
        }],
        order: [["createdAt", "DESC"]]
    }).then(data => res.send(data)).catch(err => res.status(500).send(err))
})

module.exports = router
