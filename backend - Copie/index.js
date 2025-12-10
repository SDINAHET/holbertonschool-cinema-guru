const express = require('express');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/auth')
const titlesRouter = require('./routes/titles')
const userActivitiesRouter = require('./routes/userActivities')
const fs = require("fs");
require('dotenv').config()

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
}

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mon API",
      version: "1.0.0",
      description: "Documentation de l'API",
    },
    servers: [
      { url: "http://localhost:8000" },
    ],
  },
  apis: ["./routes/**/*.js"], // où tu mets tes commentaires JSDoc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));

app.use(cors(corsOptions))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/titles', titlesRouter);
app.use('/api/activity', userActivitiesRouter);

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

app.listen(port, () => console.log('Server running...'));
