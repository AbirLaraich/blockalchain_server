// Importation des modules nécessaires
const express = require('express')
const ArrivageRouter = require('./router/arrivage')
const cors = require('cors')


// Création de l'application Express
const app = express()
// Configuration de CORS

app.use(cors())
app.use(express.json());


// Configuration du middleware d'analyse des données URL encodées
app.use(express.urlencoded({ extended: true }))

// Configuration des routes
app.use('/', ArrivageRouter());  

// Lancement du serveur remplacer ton ip-machine par l'ip de ta machine 
app.listen(3010, "localhost", async() => {
    console.log("Serveur lancé");
 
})

