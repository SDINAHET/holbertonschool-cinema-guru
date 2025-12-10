const express = require('express');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/auth')
const titlesRouter = require('./routes/titles')
const userActivitiesRouter = require('./routes/userActivities')
const fs = require("fs");
require('dotenv').config()

/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Cinema Guru API
 *   version: 1.0.0
 *   description: API documentation for the Holberton Cinema Guru project
 *
 * servers:
 *   - url: http://localhost:8000
 *     description: Serveur local de développement
 *
 * tags:
 *   - name: Auth
 *     description: User authentication and identity verification
 *   - name: Titles
 *     description: Movies catalog and advanced search
 *   - name: User Titles
 *     description: User's favorite and watch-later lists
 *   - name: Activity
 *     description: User activities on titles
 *   - name: System
 *     description: API root & documentation
 *   - name: Health
 *     description: API health check
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /:
 *   get:
 *     summary: API root
 *     description: |
 *       Point d'entrée de la Cinema Guru API.
 *       Permet de vérifier que l'API fonctionne et donne des informations générales.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Informations générales sur l'API.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: Cinema Guru API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 status:
 *                   type: string
 *                   example: OK
 *                 docs:
 *                   type: string
 *                   example: /api-docs
 *
 * /api/docs:
 *   get:
 *     summary: Swagger UI documentation
 *     description: Redirige vers l'interface Swagger UI.
 *     tags: [System]
 *     responses:
 *       302:
 *         description: Redirection vers Swagger UI.
 *
 * /api/health:
 *   get:
 *     summary: Check API health
 *     description: Vérifie l'état de santé de l'API.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: L'API est opérationnelle.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-12-06T12:34:56.000Z
 */

const app = express();
console.log("=== CINEMA GURU BACKEND CHARGÉ ===");
app.use((req, res, next) => {
  console.log("Requête reçue:", req.method, req.url);
  next();
});

const corsOptions = {
    origin: 'http://localhost:3000',
}

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon API',
      version: '1.0.0',
      description: 'API documentation for the Holberton Cinema Guru project',
    },
    servers: [
      { url: 'http://localhost:8000' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // IMPORTANT : chemins vers tes fichiers de routes
  apis: ['./routes/**/*.js', './index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
console.log("=== MONTAGE SWAGGER SUR /api-docs ===");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));

app.use(cors(corsOptions))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/titles', titlesRouter);
app.use('/api/activity', userActivitiesRouter);

app.get('/test-swagger', (req, res) => {
  res.send('OK SWAGGER TEST');
});

// 👇 routes système / santé
// app.get('/', (req, res) => {
//   res.json({
//     name: 'Cinema Guru API',
//     version: '1.0.0',
//     status: 'OK',
//     docs: '/api-docs',
//   });
// });
app.get('/', (req, res) => {
  res.send(`
    <h1>Cinema Guru API</h1>
    <p>✅ API en ligne</p>
    <p>📚 Documentation : <a href="/api-docs">Swagger UI</a></p>
  `);
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     description: Vérifie l'état de santé de l'API.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: L'API est opérationnelle.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-12-06T12:34:56.000Z
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/docs', (req, res) => {
  // petite redirection pratique vers Swagger UI
  res.redirect('/api-docs');
});



sequelize.sync({ force: false })
    .then(async () => {
        console.log(`Database & tables created!`);
        console.log('Postgress Connected');
        fs.readFile("dump.sql", 'utf8', async (err, data) => {
            await sequelize.query(data)
            console.log("DB Seeded");
        })
    })
    .catch(err => console.log(err));

const port = process.env.PORT || 8000;

console.log("=== PRÊT À ECOUTER SUR LE PORT", port, "===");
app.listen(port, () => console.log('Server running...'));
