const express = require('express')
const router = express.Router()
const registerRouter = require('./register')
const loginRouter = require('./login')
const { verifyToken } = require('../../utils/tokens')

router.use('/register', registerRouter)
router.use('/login', loginRouter)

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & user session
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Verify access token
 *     description: |
 *       Vérifie le token JWT envoyé par le client et retourne les informations
 *       de l'utilisateur si le token est valide.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valide, informations utilisateur retournées.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: johndoe
 *       401:
 *         description: Token invalide ou manquant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token
 */

router.post('/', verifyToken, (req, res) => {
    if (req.userId && req.username) {
        res.send({
            userId: req.userId,
            username: req.username,
        })
    } else {
        res.status(401).send({
            message: "Invalid token"
        })
    }
})

module.exports = router
