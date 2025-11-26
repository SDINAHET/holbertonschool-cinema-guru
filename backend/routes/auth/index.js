const express = require('express')
const router = express.Router()
const registerRouter = require('./register')
const loginRouter = require('./login')
const { verifyToken } = require('../../utils/tokens')

apis: [
  './index.js',
  './routes/**/*.js'
],

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and identity verification
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Verify JWT token
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 username:
 *                   type: string
 *       401:
 *         description: Invalid or missing token
 */

router.use('/register', registerRouter)
router.use('/login', loginRouter)

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
