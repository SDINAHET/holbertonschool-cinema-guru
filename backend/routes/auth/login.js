const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const { comparePassword } = require('../../utils/password')
const { generateToken } = require('../../utils/tokens')

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: |
 *       Authentifie un utilisateur à partir du `username` et du `password`.
 *       Retourne un token JWT si les identifiants sont corrects.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Authentification réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 accessToken:
 *                   type: string
 *                   description: Token JWT
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Identifiants incorrects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Incorrect credentials
 *       500:
 *         description: Erreur interne lors de la génération du token.
 */

router.post('/', async (req, res) => {
    User.findOne({ where: { username: req.body.username } })
        .then(user => {
            comparePassword(req.body.password, user.password)
                .then(correct => {
                    if (correct) {
                        generateToken(user.id, user.username)
                            .then(token => res.send({
                                message: 'Logged in successfully',
                                accessToken: token,
                            }))
                            .catch(err => res.status(500).send(err))
                    } else {
                        res.status(401).send({ message: 'Incorrect credentials' })
                    }
                })
        })
        .catch(() => res.status(401).send({ message: 'Incorrect credentials' }))
})

module.exports = router
