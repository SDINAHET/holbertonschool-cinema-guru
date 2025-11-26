const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const { generateToken } = require('../../utils/tokens')

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
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
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid username format
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
