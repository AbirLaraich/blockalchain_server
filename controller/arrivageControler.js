const ArrivageModel = require('../model/arrivageModel');

class ArrivageController {
      
      constructor(dbInstance) {
            this.arrivageModel = new ArrivageModel(dbInstance);
      }

      // Cette fonction gère la création d'un nouvel arrivage en utilisant les données de la demande HTTP.
      async controleurAncrage(req, res) {
            // Récupération des données de la demande

            const { arrivages } = req.body;
            try {
                  if (arrivages) {
                        const TransactionDetails = await this.arrivageModel.ancrageArrivage(arrivages,res);
                        if (TransactionDetails) {
                              return res.status(200).json({ message: 'Ancrage créé avec succès', TransactionDetails });
                        }
                  } else {
                        return res.status(400).json({
                              message: "Imposible de lire les données d'arrivage ",
                        });
                  }
            } catch (error) {
                  // En cas d'erreur, enregistre l'erreur et renvoie une réponse d'erreur JSON
                  console.error("Erreur lors de la création de l'ancrage :", error);
                  return res.status(500).json({ message: "Une erreur s'est produite." });
            }
      }
}

module.exports = ArrivageController;
