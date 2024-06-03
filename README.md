# Documentation Serveur Blockchain


## Sommaire

- [Installation](#installation)
- [Execution](#execution)
- [Envoies](#envoies)

## Installation

1. Installer Node.js sur votre machine : [https://nodejs.org/fr](https://nodejs.org/fr)
2. Exécutez `npm install` pour installer les dépendances nécessaires.

## Execution

1. Pour lancer les serveur js faire `npm run start` (côté serveur)
2. Pour faire un test d'envoi des données faire `npm run test` (côté client)

## Envoies


```javascript
async function sendArrivageToBlockchain(infosArrivage) {
      try {
          const response = await fetch('http://localhost:3010/ancrage-arrivage', {
                  method: 'POST',
                  headers: {
                        'content-type': 'application/json',
                  },
                  body: JSON.stringify({
                        arrivages: infosArrivage,
                  }),
            });

            if (!response.ok) {
                  // La requête a échoué, récupére le message d'erreur du serveur
                  const errorData = await response.json();
                  const errorMessage = errorData.message; // Obtene le message d'erreur du serveur
                  throw errorMessage; // Lance le message d'erreur
            }

            // La requête a réussi, renvoyez les données
            const data = await response.json();
            return data;
      } catch (error) {
            throw error;
      }
}
```

## Reception

Les données passe par la route :

```javascript
router.post('/ancrage-arrivage', async (req, res) => {
      await arrivageController.controleurAncrage(req, res);
});
```

Puis sont envoyées au contrôleur qui vérifie les données :


```javascript
 async controleurAncrage(req, res) {
            // Récupération des données de la demande

            const { arrivages } = req.body;
            try {
                  if (arrivages) {
                        const idTransaction = await this.arrivageModel.ancrageArrivage(arrivages);
                        if (idTransaction) {
                              return res.status(200).json({ message: 'ancrage créé avec succès', idTransaction });
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
```

Le contrôleur passe les données au modèle qui va se charger d'ancrer les données dans la blockchain :

```javascript
 async controleurAncrage(req, res) {
            // Récupération des données de la demande

          async ancrageArrivage(arrivageAncrage) {
            try {
                  console.log("Données d'arrivage : ");
                  console.dir(arrivageAncrage, { depth: null });
                 return "hash-transaction";
            } catch (error) {
                  console.error("Erreur lors de la création de l'ancrage :", error);
            }
      }
      }
```

N'hésite pas à me contacter si tu as besoin de plus d'aide !






