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
 *     description: Authenticates a user by username and password.
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
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Invalid username or password
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
