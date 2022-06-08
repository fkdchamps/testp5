/* ************** */
/* PAGE D'ACCUEIL */
/* ************** */

  /* **************************** */
  /* 1) définitions des fonctions */
  /* **************************** */

/* fonction de création de la balise <a> qui englobe chaque article */
function createBlockLinkArticle(newAnchor, productId, i) {
    
    newAnchor.href = "./front/html/product.html?id=" + productId;//on lui attribue l'url de référence du lien (sa cible)
    newAnchor.id = "anchor" + i;//on affecte un id# unique à cette balise
    /* affectation de la balise <a> dans le html */
    const parentSection = document.getElementById("items");//on va chercher le bloc parent de ce nouveau <a>
    parentSection.appendChild(newAnchor);//on injecte la balise html de lien
    console.log("newAnchor juste créé", newAnchor);
};

/* fonction d'insertion de l'article dans la balise <a> */
function insertArticle(newAnchor, newArticle, imgsrc, kanapName, imgAlt, descript, i) {
    newArticle = document.createElement("article");//on crée l'élément <article>
    newArticle.id = "article" + i;// attribution id
    newArticle.innerHTML = "<img src=" + imgsrc + " alt=" + imgAlt + ">" +
    "<h3 class='productName'>" + kanapName + "</h3>" +
    "<p class='productDescription'>" + descript + "</p>";// production du contenu
    newAnchor.appendChild(newArticle);// ajout de l'article dans le bloc parent
};

/* fonction globale de création et affichage d'un article */
function createArticle(product, i) {
    /* on affecte chaque attribut de produit à une variable */  
    let productId = product._id;
    let imgsrc = product.imageUrl;
    let kanapName = product.name;
    let imgAlt = product.altTxt;
    console.log(product.altTxt);
    let descript = product.description;
    
    /* création de la balise <a> lien englobant l'article */
    let newAnchor = document.createElement("a");//on crée une nouvelle balise//délocalisation de variable    
    createBlockLinkArticle(newAnchor, productId, i);//création de l'élément <a> parent-lien de l'article

    /* creation, identification(#), implémentation, affectation dans son parent<a>, de l'article du produit */
    let newArticle;/*  = document.createElement("article"); *///déclaration variable remontée
    insertArticle(newAnchor, newArticle, imgsrc, kanapName, imgAlt, descript, i);//respecter l'ordre des paramètres tel que dans la déclaration
};

/* fonction d'exploitation et affichage des données */
function displayAll(ArrayProduitsJson) {//affichage de tout le stock d'articles issu de la REPONSE
    console.log("tableau de l'api", ArrayProduitsJson);
    for (let i=0; i<ArrayProduitsJson.length; i++) {
        let product=ArrayProduitsJson[i];
        createArticle(product,i); 
    }
}

/* fonction de récupération de promise */
function getResData(res) {
    if (res.ok) {//vérifie true si succès de réponse
        /* console.log("retour", res.json()) */
        return res.json();//retourne la méthode json de cette réponse
    }
}  

/* fonction de retour d'erreur */
function errorReturn(err) {//récupération d'erreur si échec de réponse de la promesse
    console.log("Une erreur est survenue");
    console.log(err);
}

    /* **************************** */
    /* 2) CODE PRINCIPAL DE LA PAGE */
    /* **************************** */

/* Fonction globale de la page: on va requêter les données sur l'API, puis on extrait la réponse de promise au format JSON, puis on exploite toutes les données reçues pour l'affichage du stock d'articles, et enfin un retour d'erreur */
function mainDisplay() {
    fetch("http://localhost:3000/api/products")//requete de promesse
    .then(getResData) 
    .then(displayAll)
    .catch(errorReturn)
}
mainDisplay();//execution du code global

