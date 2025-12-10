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
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               username:
 *                 type: string
 *                 description: Optional username
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.use('/register', registerRouter)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in and obtain a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful, token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.use('/login', loginRouter)

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
