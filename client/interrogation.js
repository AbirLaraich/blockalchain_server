document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de Web3.js
      if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable(); // Demande à l'utilisateur d'autoriser l'accès au compte Ethereum
      } else {
        console.error('Web3 is not available. Please install MetaMask or use an Ethereum-compatible browser.');
        return;
      }
          
        // Interraction avec le formulaire de recherche
        var formu = document.getElementById("recherche-form");
        formu.addEventListener('submit', async (event) => {
          event.preventDefault(); // Empêche la soumission du formulaire par défaut

          //Récupération des données depuis les champs du formulaire
            var code_magasin = document.getElementById("code_magasin_r").value.replace(/\s/g, "");
            var code_lot = document.getElementById("code_lot_r").value.replace(/\s/g, "");
            var code_article = document.getElementById("code_article_r").value.replace(/\s/g, "");
      
          // Appeler la fonction pour récupérer les infos sur l'article
            await getArticleInformations(code_magasin,code_lot,code_article);
      });
      
      async function getArticleInformations(code_magasin,code_lot,code_article) {
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
          
          //vérifier le nombre de commandes
            const nb_commande = await myContract.methods.getTaille().call({
              from: senderAddress,
              gas: '5000000'
            });
            console.log("Nombre de commandes : ", nb_commande);

          // Appel à la fonction "getArticle"
            const resultat = await myContract.methods.getArticle(code_magasin,code_lot,code_article).call({
              from: senderAddress,
              gas: '5000000'
            });
            
            console.log("Transaction hash : \n", resultat);
            const resultatAvecSautsDeLigne = resultat.replace(/\n/g, '<br>');
            document.getElementById("result").innerHTML = "<h1> Résultats</h1><br><div id='resultat'>"+resultatAvecSautsDeLigne+"</div>";
    
        } catch (error) {
          console.error('Erreur lors du déploiement du contrat : ', error);
          alert("L'article n'existe pas dans la blockchain")
        }
      }
    
    });
     