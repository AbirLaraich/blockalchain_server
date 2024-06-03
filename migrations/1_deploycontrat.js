const fs = require('fs');
const path = require('path');

const CertificationCommande = artifacts.require("CertificationCommande");

module.exports = async function (deployer) {
  await deployer.deploy(CertificationCommande);
  const deployedContract = await CertificationCommande.deployed();

  // Chemin du fichier de sortie pour l'ABI
  const abiFilePath = path.join(__dirname, 'abi', 'ContratABI.json');

  // Créer le dossier 'abi' s'il n'existe pas
  if (!fs.existsSync(path.dirname(abiFilePath))) {
    fs.mkdirSync(path.dirname(abiFilePath), { recursive: true });
  }

  // Insérer le lien hypertexte vers la page de décodeur Ethereum
  //const decoderLink = '<a href="https://lab.miguelmota.com/ethereum-input-data-decoder/example/" target="_blank">Lien vers la page de décodeur Ethereum : </a>';
  const decoderLink = "https://lab.miguelmota.com/ethereum-input-data-decoder/example/";
  const lineToAdd = `Lien hypertexte vers la page du décodeur Ethereum : \n${decoderLink}\n\n`;

  // Écrire le lien et l'ABI dans le fichier
  fs.writeFileSync(abiFilePath, lineToAdd);
  fs.appendFileSync(abiFilePath,"L'ABI du contrat qui est à copier dans le champs ABI du décodeur : \n");
  fs.appendFileSync(abiFilePath, JSON.stringify(CertificationCommande.abi, null, 2));

  console.log("ABI enregistré dans le fichier :", abiFilePath,"\n");
};
