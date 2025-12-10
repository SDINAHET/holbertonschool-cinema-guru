const express = require('express')
const router = express.Router()
const UserActivity = require('../models/UserActivity')
const User = require('../models/User')
const { Title } = require('../models/Title')
const { verifyToken } = require('../utils/tokens')

/**
 * @swagger
 * tags:
 *   name: Activity
 *   description: User activities on titles
 */

/**
 * @swagger
 * /api/activity:
 *   get:
 *     summary: Get all user activities
 *     description: |
 *       Retourne la liste de toutes les activités des utilisateurs,
 *       triées par date de création (plus récentes en premier), avec :
 *         - le `username` de l'utilisateur
 *         - le `title` associé.
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des activités retournée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   userId:
 *                     type: integer
 *                     example: 3
 *                   titleId:
 *                     type: integer
 *                     example: 5
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-01-01T12:34:56.000Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-01-01T12:35:10.000Z
 *                   user:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         example: johndoe
 *                   title:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: The Matrix
 *       401:
 *         description: Token manquant ou invalide.
 *       500:
 *         description: Erreur serveur lors de la récupération des activités.
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
