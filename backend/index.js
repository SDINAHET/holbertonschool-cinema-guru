const express = require('express');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/auth')
const titlesRouter = require('./routes/titles')
const userActivitiesRouter = require('./routes/userActivities')
const fs = require("fs");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config()

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
}
// app.use(cors(corsOptions))
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type,Authorization",
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * ⭐ Swagger configuration
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cinema Guru API',
      version: '1.0.0',
      description: 'API documentation for the Holberton Cinema Guru project',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],

    // ⭐ AJOUT ICI — sécurité JWT globale
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },

  // Tu pourras ajouter des commentaires JSDoc dans tes fichiers de routes,
  // Swagger ira les lire via ce pattern :
  apis: ['./routes/**/*.js', './index.js'],  // chemins relatifs au dossier backend
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Swagger UI documentation
 *     description: Serves the interactive Swagger UI for the Cinema Guru API.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Swagger UI HTML page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Swagger UI HTML
 */
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', cors());

/**
 * 🔌 Routes API existantes
 */

app.use('/api/auth', authRouter);
app.use('/api/titles', titlesRouter);
app.use('/api/activity', userActivitiesRouter);


/**
 * @swagger
 * /:
 *   get:
 *     summary: API root
 *     description: Displays a simple message confirming that the Cinema Guru backend is running.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Backend is up and running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Cinema Guru backend is running ✅
 */
app.get('/', (req, res) => {
  res.send('Cinema Guru backend is running ✅');
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     description: Returns API health status.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: API is healthy
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is healthy' });
});


/**
 * 🗄️ Sequelize init + seed
 */
// sequelize.sync({ force: true })
//     .then(async () => {
//         console.log(`Database & tables created!`);
//         console.log('Postgress Connected');
//         // fs.readFile("dump.sql", 'utf8', async (err, data) => {
//         //     await sequelize.query(data)
//         //     console.log("DB Seeded");
//         // })
//         fs.readFile('dump.sql', 'utf8', async (err, data) => {
//             if (err) {
//                 console.error('Error reading dump.sql:', err);
//                 return;
//             }
//             await sequelize.query(data);
//             console.log('DB Seeded');
//         });
//     })
//     .catch(err => console.log(err));

// const port = process.env.PORT || 8000;

app.listen(port, () => console.log('Server running...'));

sequelize.sync();
