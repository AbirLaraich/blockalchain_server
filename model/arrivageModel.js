
//Importation de web3 pour l'interaction avec le SC
var {Web3} = require('web3'); 
var web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));

class ArrivageModel {
      constructor(dbInstance) {
            this.db = dbInstance;
      }

      async ancrageArrivage(arrivageAncrage,res) {
            try {
                  console.log("Données d'arrivage : ");
                  
                  console.dir(arrivageAncrage, { depth: null });

                  //Extraction des données
                  const data = arrivageAncrage;
                  const code_magasin = data.code_magasin;
                  const n_commande = data.id;
                  var date_arrivee = data.date_livraison;
                  var date_cloture = data.date_de_cloture;
                  const fournisseurId = data.fournisseur.id;
                  const fournisseurAdresse = data.fournisseur.adresse;
                  const distance = data.distance;
                  const commentaire = data.commentaire;
                
                  //Mise en forme des dates
                  const date1 = new Date(date_arrivee);
                  const date2 = new Date(date_cloture);
                  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                  date_arrivee = date1.toLocaleDateString('fr-FR', options);
                  date_cloture = date2.toLocaleDateString('fr-FR',options);
                
                  // Utilisation de la fonction pour obtenir le mapping
                  const mappingPoidsResultat = this.construireMappingPoids(data);
                
                  // Adapter les données pour mon code Solidity
                  const cleMapping = Object.keys(mappingPoidsResultat);
                  const valeursMapping = cleMapping.map((cle) => mappingPoidsResultat[cle]);
                
                  // Appelez la fonction pour ajouter une commande
                  const TransactionDetails =  await this.ajouterCommande(code_magasin,n_commande,date_arrivee,date_cloture,fournisseurId,fournisseurAdresse,distance,cleMapping,valeursMapping,commentaire);

                  //res.status(200).json({ message: 'Data received and anchored successfully' }); // pas besoin, déjà fait dans la partie controller

                  return TransactionDetails; //* ici tu devra retourner le hash de transaction

            } catch (error) {
                  console.error("Erreur lors de la création de l'ancrage :", error);
            } 
      }
      // Fonction pour construire le mapping
      construireMappingPoids(data) {
            const mappingPoids = {};
      
            // Parcours de chaque lot dans les données
            data.lots.forEach((lotData) => {
            // Parcours de chaque article dans le lot
            lotData.articles.forEach((article) => {
                  const cle = `${lotData.lot.id}${article.id}`;
                  const poids = parseFloat(article.poids);
      
                  // Ajouter la clé et le poids au mapping
                  mappingPoids[cle] = poids;
            });
            });
      
            return mappingPoids;
    }
    // Ajouter la commande depuis le SC
    async ajouterCommande(code_magasin,n_commande,date_arrivee,date_cloture,fournisseurNom,fournisseurAdresse,distance,cleMapping,valeursMapping,commentaire) {
            try {
                  const accounts = await web3.eth.getAccounts();
                  const senderAddress = accounts[0]; // 1ère @ dans MetaMask
            
                  //Récupération de l'adresse du contrat à partir du fichier json sous le répertoire 'build'
                  const detailsContrat = require('../build/contracts/CertificationCommande.json');
                  const contractAddress = detailsContrat.networks[Object.keys(detailsContrat.networks)[0]].address;
            
                  //Récupérer l'abi du SC depuis le fichier json sous le répertoire 'build'
                  const contractABI = detailsContrat.abi; 
            
                  // Un nouvel objet de contrat
                  const myContract = new web3.eth.Contract(contractABI, contractAddress);
            
                  //Tester si la commande existe déjà avant de lancer la transaction
                  const test = await myContract.methods.commandeExists(code_magasin,n_commande).call({
                        from: senderAddress,
                        gas: '5000000'
                  });
                  var transaction = "";

                  if(!test){
                        // Appel à la fonction "ajouterLot" car la commande n'existe pas
                        transaction = await myContract.methods.ajouterCommande(code_magasin,n_commande,date_arrivee,date_cloture,fournisseurNom,fournisseurAdresse," ",distance,cleMapping,valeursMapping,commentaire).send({
                        from: senderAddress,
                        gas: '5000000'
                        }); 
                  }
                  else{ //Si la commande existe -> Possibilité de modification :

                        //1ère méthode : en remplaçant tous les lots et les articles par les nouveaux blocs dans le fichier arrivage.json
                        transaction = await myContract.methods.modifierCommande(code_magasin,n_commande,cleMapping,valeursMapping).send({
                        from: senderAddress,
                        gas: '5000000'
                        });

                        //2ème méthode : en ajoutant le nouveau article (nouvelle transaction par article) -> il faut connaitre l'article à ajouter et extraire ses infos (n_lot, n_article et poids_article) à partir de arrivage.json
                        /*const transaction = await myContract.methods.ajouterArticle(code_magasin,n_commande,n_lot,n_article,poids_article).send({
                        from: senderAddress,
                        gas: '5000000'
                        }); */                     
                  }
                  //const abiDecoder = require('abi-decoder');
                  const blockNumber = await web3.eth.getBlockNumber();
                  const hashTransaction = transaction.transactionHash;
                  let input = (await web3.eth.getTransactionFromBlock(blockNumber, 0)).input;
                  console.log(input);
                  let resultat = {
                        TransactionHash : hashTransaction,
                        Data : input
                  };
                  
                  return resultat;

            } catch (error) {
                  console.error('Erreur lors du déploiement du contrat : ', error);
            }
      }
}

module.exports = ArrivageModel;
