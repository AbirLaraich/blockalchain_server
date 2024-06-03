// Importation des modules nécessaires
const express = require('express')
const ArrivageRouter = require('./router/arrivage')
const cors = require('cors')


// Création de l'application Express
const app = express()
// Configuration de CORS

app.use(cors({
    credentials: true,
    preflightContinue: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH' , 'DELETE', 'OPTIONS'],
    origin: true
}));
app.use(express.json());


// Configuration du middleware d'analyse des données URL encodées
app.use(express.urlencoded({ extended: true }))

// Configuration des routes
app.use('/', ArrivageRouter());  

// Lancement du serveur remplacer ton ip-machine par l'ip de ta machine 
app.listen(3010, "localhost", async() => {
    console.log("Serveur lancé");
 
})

