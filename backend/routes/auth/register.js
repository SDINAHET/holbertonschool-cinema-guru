const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const { generateToken } = require('../../utils/tokens')

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: |
 *       Crée un nouvel utilisateur avec `username` et `password`.
 *       Retourne un token JWT automatiquement après l'inscription.
 *     tags: [Auth]
 *
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
 *
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès + JWT retourné.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registered successfully
 *                 accessToken:
 *                   type: string
 *                   description: Token JWT
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *       400:
 *         description: Username déjà utilisé ou invalide.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid username
 *
 *       500:
 *         description: Erreur serveur lors de la génération du token ou de la création.
 */

router.post('/', async (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
    })
        .then(data => {
            generateToken(data.id, data.username)
                .then(token => res.send({
                    message: 'Registered successfully',
                    accessToken: token,
                }))
                .catch(err => res.status(500).send(err))
        })
        .catch(() => res.status(400).send({ message: 'Invalid username' }))
})

module.exports = router
