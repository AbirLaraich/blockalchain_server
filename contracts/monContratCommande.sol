// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract CertificationCommande {
    struct Fournisseur{
        string id;
        string adresse;
    }

    struct Commande {
        string code_magasin;
        string n_commande;
        string date_arrivee;
        string date_cloture;
        Fournisseur provenance_fournisseur;
        string code_sanitaire;
        uint256 distance;
        string[] code_articles; // la liste des codes articles : Concatination du N° lot et N° article
        uint256[] poids_articles; //les poids des articles, il faut que la taille des 2 listes soit égales
        string commentaire;
    }

    Commande[] public commandes;
    uint256 public taille;

    constructor() {}

    function ajouterCommande(
        string memory _code_magasin,
        string memory _n_commande,
        string memory _date_arrivee,
        string memory _date_cloture,
        string memory _id_fournisseur,
        string memory _adresse_fournisseur,
        string memory _code_sanitaire,
        uint256 _distance,
        string[] memory _code_articles,
        uint256[] memory _poids_articles,
        string memory _commentaire
    ) public {
        require(!commandeExists(_code_magasin, _n_commande),"La commande existe deja!");
        // Créer une nouvelle commande
        commandes.push(Commande({
            code_magasin: _code_magasin,
            n_commande: _n_commande,
            date_arrivee: _date_arrivee,
            date_cloture: _date_cloture,
            provenance_fournisseur: Fournisseur({
                id: _id_fournisseur,
                adresse: _adresse_fournisseur
            }),
            code_sanitaire: _code_sanitaire,
            distance: _distance,
            code_articles: _code_articles,
            poids_articles: _poids_articles,
            commentaire: _commentaire
        }));
        taille = commandes.length;
    }


    function modifierCommande(
        string memory _code_magasin,
        string memory _n_commande,
        string[] memory _code_articles,
        uint256[] memory _poids_articles
    ) public {
        require(commandeExists(_code_magasin, _n_commande), "La commande n'existe pas");

        for (uint256 i = 0; i < taille; i++) {
            if (compareStrings(commandes[i].code_magasin, _code_magasin) && compareStrings(commandes[i].n_commande, _n_commande)) {
                // Modifier la commande existante
                commandes[i].code_articles = _code_articles;
                commandes[i].poids_articles = _poids_articles;
            }
        }
    }
    
    function ajouterArticle(string memory _code_magasin,string memory _n_commande, string memory _n_lot, string memory _n_article, uint256 _poids_article) public {
        require(commandeExists(_code_magasin, _n_commande),"La commande a modifier n'existe pas");
        require(!articleExists(_code_magasin, _n_lot, _n_article),"L'article a ajouter existe deja");
        for(uint256 i = 0; i< taille; i++){
            if(compareStrings(commandes[i].code_magasin,_code_magasin) && compareStrings(commandes[i].n_commande,_n_commande)){
                commandes[i].code_articles.push(_n_article);
                commandes[i].poids_articles.push(_poids_article);
            }
        } 
    }

    function commandeExists(string memory _code_magasin, string memory _n_commande) public view returns(bool){
    for(uint256 i = 0; i < taille; i++){
        if(compareStrings(commandes[i].code_magasin,_code_magasin) && compareStrings(commandes[i].n_commande,_n_commande)) {
            return true;
        }
    }
    return false;
    }

    //on fait une conversion de type car impossible de comparer un string storage to string memory
    function compareStrings(string memory a, string memory b) public pure returns (bool) {
    return (keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b)));
    }

    function getTaille() public view returns (uint256) {
        return taille;
    }

    function articleExists(string memory _code_magasin, string memory _n_lot, string memory _n_article) public view returns(bool){
        string memory code_article_recherche = string(abi.encodePacked(_n_lot , _n_article));
        for(uint256 i = 0; i< taille; i++){
            if(compareStrings(commandes[i].code_magasin,_code_magasin)){
                for(uint256 j = 0; j<commandes[i].code_articles.length; j++){
                    if(compareStrings(commandes[i].code_articles[j],code_article_recherche))
                        return true;
                }
            }
        }
        return false;
    }

    function getCommande(string memory _code_magasin, string memory _n_lot, string memory _n_article) public view returns(Commande memory){
        require(articleExists(_code_magasin, _n_lot, _n_article),"La commande n'existe pas");
        string memory code_article_recherche = string(abi.encodePacked(_n_lot , _n_article));
        for(uint256 i = 0; i< taille; i++){
            if(compareStrings(commandes[i].code_magasin,_code_magasin)){
                for(uint256 j = 0; j<commandes[i].code_articles.length; j++){
                    if(compareStrings(commandes[i].code_articles[j],code_article_recherche))
                        return commandes[i];
                }
            }
        }        
    }

    function getPoidsArticle(string memory _code_magasin, string memory _n_lot, string memory _n_article) public view returns(uint256){
        require(articleExists(_code_magasin, _n_lot, _n_article),"L'article n'existe pas");
        string memory code_article_recherche = string(abi.encodePacked(_n_lot , _n_article));
        for(uint256 i = 0; i< taille; i++){
            if(compareStrings(commandes[i].code_magasin,_code_magasin)){
                for(uint256 j = 0; j<commandes[i].code_articles.length; j++){
                    if(compareStrings(commandes[i].code_articles[j],code_article_recherche))
                        return commandes[i].poids_articles[j];
                }
            }
        } 
    }

    function getArticle(string memory _code_magasin, string memory _n_lot, string memory _n_article) public view returns(string memory){
        require(articleExists(_code_magasin, _n_lot, _n_article),"L'article n'existe pas dans la blockchain");
        Commande memory commande = getCommande(_code_magasin, _n_lot, _n_article);
        uint256 poids_article = getPoidsArticle(_code_magasin, _n_lot, _n_article);
        string memory res = string(abi.encodePacked("Code du magasin : " , commande.code_magasin,
                                                    "\n Numero de Commande: " , commande.n_commande,
                                                    "\n Date d'arrivee de la commande: " ,commande.date_arrivee,
                                                    "\n Date de cloture de la commande: " ,commande.date_cloture,
                                                    "\n Fournisseur : " ,commande.provenance_fournisseur.id,
                                                    "\n Adresse du Fournisseur : " ,commande.provenance_fournisseur.adresse,
                                                    "\n Code sanitaire : " ,commande.code_sanitaire,
                                                    "\n Code du Lot : " , _n_lot,
                                                    "\n code Article : " , _n_article,
                                                    "\n Poids : " , toString(poids_article),"kg",
                                                    "\n Distance : ", toString(commande.distance),"km",
                                                    "\n Commentaire : ", commande.commentaire,"\n"));

        if (commande.distance <= 80) {
            res = string(abi.encodePacked(res, "<b>C'est un produit qui provient d'un circuit de proximite</b>"));
        } else {
            res = string(abi.encodePacked(res, "<b>C'est un produit qui ne provient pas d'un circuit de proximite</b>"));
        }
        return res;
    }

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
