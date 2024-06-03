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
      const errorData = await response.json();
      const errorMessage = errorData.message;
      throw errorMessage;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}


async function main() {
  try {
    const dataArrivageJSON = require('./arrivage.json')
    try {
      const result = await sendArrivageToBlockchain(dataArrivageJSON);
      console.log('Réponse du serveur:', result);
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
    }
  } catch (error) {
    console.error('Erreur lors du chargement du fichier JSON:', error);
  }
}

// Appelle la fonction principale
main();
