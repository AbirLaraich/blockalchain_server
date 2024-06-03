const express = require('express');
const ArrivageRouter = require('./router/arrivage');
const cors = require('cors');

const app = express();

// Configuration de CORS
const corsOptions = {
  origin: 'http://localhost:8081',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Pour gérer les requêtes préflight OPTIONS
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des routes
app.use('/', ArrivageRouter());

// Lancement du serveur
app.listen(3010, "localhost", () => {
  console.log("Serveur lancé sur le port 3010");
});
