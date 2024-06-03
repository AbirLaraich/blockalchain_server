// Interraction avec le fichier de données
  //const data = require('./4_exempleDatas.js');
  //import data from './4_exempleDatas.js';
  document.addEventListener('DOMContentLoaded', function() {
// Initialisation de Web3.js
  if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // Demande à l'utilisateur d'autoriser l'accès au compte Ethereum
  } else { 
    console.error('Web3 is not available. Please install MetaMask or use an Ethereum-compatible browser.');
    return;
  }

//Récupération des données depuis le fichier Json et appel à la fonction AjouterCommande
 extractionDonneesEtAncrage();

//Fonction pour extraire les données de la commande
  async function extractionDonneesEtAncrage(){
    try{
      const data = await (await fetch('../client/exempleData.json')).json();
      console.log(data.arrivage.code_magasin);
      const code_magasin = data.arrivage.code_magasin;
      const n_commande = data.arrivage.id;
      var date_arrivee = data.arrivage.date_livraison;
      var date_cloture = data.arrivage.date_de_cloture;
      const fournisseurNom = data.arrivage.fournisseur.nom;
      const fournisseurAdresse = data.arrivage.fournisseur.adresse;
      const distance = data.arrivage.distance;
      const commentaire = data.commentaire.content;

    //Mise en forme des dates
      const date1 = new Date(date_arrivee);
      const date2 = new Date(date_cloture);
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      date_arrivee = date1.toLocaleDateString('fr-FR', options);
      date_cloture = date2.toLocaleDateString('fr-FR',options);

    // Utilisation de la fonction pour obtenir le mapping
      const mappingPoidsResultat = construireMappingPoids(data);

    // Adapter les données pour mon code Solidity
      const cleMapping = Object.keys(mappingPoidsResultat);
      const valeursMapping = cleMapping.map((cle) => mappingPoidsResultat[cle]);

    // Appelez la fonction pour ajouter une commande
      ajouterCommande(code_magasin,n_commande,date_arrivee,date_cloture,fournisseurNom,fournisseurAdresse,distance,cleMapping,valeursMapping,commentaire);

    }catch (error) {
      console.error("Erreur lors de l'extraction des données", error);
    }
  } 
// Fonction pour construire le mapping
  function construireMappingPoids(data) {
    const mappingPoids = {};

    // Parcours de chaque lot dans les données
    data.lots.forEach((lotData) => {
        // Parcours de chaque article dans le lot
        lotData.articles.forEach((article) => {
            const cle = `${lotData.lot.lot_id}${article.article_id}`;
            const poids = parseFloat(article.article_poids);

            // Ajouter la clé et le poids au mapping
            mappingPoids[cle] = poids;
        });
    });

    return mappingPoids;
  }
  async function ajouterCommande(code_magasin,n_commande,date_arrivee,date_cloture,fournisseurNom,fournisseurAdresse,distance,cleMapping,valeursMapping,commentaire) {
    try {
      const accounts = await window.web3.eth.getAccounts();
      const senderAddress = accounts[0]; // 1ère @ dans MetaMask

      //Récupération de l'adresse du contrat à partir du fichier json sous le répertoire 'build'
        const detailsContrat = await (await fetch('../build/contracts/CertificationCommande.json')).json();
        const contractAddress = detailsContrat.networks[Object.keys(detailsContrat.networks)[0]].address;

      //Récupérer l'abi du SC depuis le fichier json sous le répertoire 'build'
        const contractABI = detailsContrat.abi; 

      // Un nouvel objet de contrat
        const myContract = new window.web3.eth.Contract(contractABI, contractAddress);

      //Tester si la commande existe déjà avant de lancer la transaction
        const test = await myContract.methods.commandeExists(code_magasin,n_commande).call({
          from: senderAddress,
          gas: '5000000'
        });
        if(!test){
          // Appel à la fonction "ajouterLot"
          const transaction = await myContract.methods.ajouterCommande(code_magasin,n_commande,date_arrivee,date_cloture,fournisseurNom,fournisseurAdresse," ",distance,cleMapping,valeursMapping,commentaire).send({
            from: senderAddress,
            gas: '5000000'
          });
          console.log(transaction);
          const blockNumber = await window.web3.eth.getBlockNumber();
          const hashTransaction = transaction.transactionHash;
          const usedGas = transaction.gasUsed;
          const resultat = "<b>Commande ajoutée dans la blockchain :</b>\nNuméro du bloc : "+blockNumber+"\nHash de la transaction : "+hashTransaction+"\nGas utilisé : "+usedGas;
          const resultatAvecSautsDeLigne = resultat.replace(/\n/g, '<br>');
          document.getElementById("resultTransaction").innerHTML = "<div class='resultat'>"+resultatAvecSautsDeLigne+"</div>";
        }
        else{
          alert("Erreur lors du déploiement du contrat : La commande existe déjà !?")
        }
    } catch (error) {
      console.error('Erreur lors du déploiement du contrat : ', error);
    }
  }
});