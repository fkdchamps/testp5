/* ******************************* */
/* PARTIE AFFICHAGE ET MODIFICATION*/
/* ******************************* */

/* **************************** */
/* initialisations et fonctions */
/* **************************** */

/* initialisations et déclarations*/

let cartridge=[];
let cartridgeString;
let parentSection;
let dataIdVar = "";
let dataIdStor;
let price; 
let imgsrc = "";
let kanapName = "";
let imgAlt = "";
let totalQuant;
let totalPr;
let ArrayData=[];

let contact;
let products = [];

/* fn récupération du panier dans le localstorage */
function getCart() {
    cartridgeString = localStorage.getItem("cartridge");
    cartridge = JSON.parse(cartridgeString);
}

/* fonction de récupération de promise de requête http API (asynchrone)*/
function getResData(res) {
    if (res.ok) {//vérifie true si succès de réponse
        return res.json();
        //retourne la méthode json de cette réponse
    }
}

/* fonction calcul et affichage de quantité et prix total */
function displayQuantPrice(cartridge, i) {
    totalQuant += parseInt(cartridge[i].quantity, 10);
    totalPr += (price*parseInt(cartridge[i].quantity, 10));
    document.getElementById("totalQuantity").textContent = totalQuant.toString();console.log("qté total affiché");
    document.getElementById("totalPrice").textContent = totalPr.toString();
    console.log("qtotale", totalQuant ,"ptotal", totalPr)
}

/* fonction d'affichage complet d'UN produit grâce aux données de la requête et grâce au panier */
function displayProduct(value, cartridge, i) {
    const apiProduct=value;
    ArrayData.push(apiProduct);//constituer un tableau des produits de requête par ajout du produit 
    
    /* affectations attributs du produit en vue de l'affichage*/
    price = apiProduct.price;
    imgsrc = apiProduct.imageUrl; console.log("imgsrc", imgsrc);
    kanapName = apiProduct.name;
    imgAlt = apiProduct.altTxt + ", " + kanapName;
    dataIdStor = apiProduct._id;

    /* création d'un nouvel élément article HTML pour ce produit */
    const newArticle = document.createElement("article");
    newArticle.classList.add("cart__item");
    newArticle.id = 'a' + i;
    newArticle.dataset.id = dataIdStor;
    newArticle.dataset.color = cartridge[i].color;//blocage

    /* remplissage de l'article sur la page*/
    newArticle.innerHTML = '<div class="cart__item__img">'+
    '<img src = ' + imgsrc + '>'+'</div>'+'<div class="cart__item__content">'+'<div class="cart__item__content__description">'+'<h2>' + kanapName + '</h2>'+'<p>' + cartridge[i].color + '</p>'+'<p>' + price + '€</p>'+'</div>'+'<div class="cart__item__content__settings">'+'<div class="cart__item__content__settings__quantity">'+'<p>Qté : </p>'+'<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' + cartridge[i].quantity + '">'+'</div>'+'<div class="cart__item__content__settings__delete">'+'<p class="deleteItem">Supprimer</p>'+'</div>'+'</div>'+'</div>';

    /* insertion de l'article dans le document*/
    parentSection.appendChild(newArticle);
}

/* fonction d'écoute de quantité d'article */
function listenChangeQuant(i, cartridge) {
    const eltquant = document.querySelector('#a'+ i +' input[name="itemQuantity"]');//récupération de l'élément à écouter
    eltquant.addEventListener("change", changeQuantity);//écoute sur l'élément, avec fonction à exécuter au changement
    
    /* fonction de changement de quantité d'un article */
    function changeQuantity(eventQuant) {//déclarée immédiatement pour faire le lien avec l'évènement
      eventQuant.preventDefault();
      eventQuant.stopPropagation();        
      
      if (eventQuant.target.value >= 1 && eventQuant.target.value <= 100) {//verifier si quantité fourchette 0-100 pour la cible de l'écoute(never trust user)
        cartridge[i].quantity = eventQuant.target.value;//alors la quantité produit dans la cellule panier change
        localStorage.setItem("cartridge", JSON.stringify(cartridge));//envoyer au localstorage
        globalDisplay();//rafraichir l'affichage
      }else{//sinon message de correction
        alert("Veuillez entrer ou sélectionner un nombre entre 1 et 100");
      }  
    }
}

/* fonction d'écoute de suppression d'article */
/* modèle idem à logique d'écoute de quantité */
function listenSupprArticle(i) {
    const eltSuppr = document.querySelector('#a'+ i +' .cart__item__content__settings__delete .deleteItem');
    eltSuppr.addEventListener("click", deleteArticle);
    /* suppression d'article */
    function deleteArticle(eventSuppr) {//suppression d'article
        eventSuppr.preventDefault();
        eventSuppr.stopPropagation();
        cartridge.splice(i,1);
        localStorage.setItem("cartridge", JSON.stringify(cartridge));
        globalDisplay();//rafraichir l'affichage
        return eventSuppr
    }
}

/* fonction de retour d'erreur */
function errorReturn(err) {//récupération d'erreur si échec de réponse de la promesse
    console.log("une erreur est survenue", err);
}


/* *********************** */
/* code global d'affichage */
/* *********************** */

function globalDisplay() {
    getCart();//recup panier localstorage
    totalQuant = 0;//initialisations
    totalPr = 0;
    parentSection = document.getElementById("cart__items");
    parentSection.innerHTML = "";//initialisation de l'affichage des articles
    /* remplissage d'affichage prix total et quantité totale */
    document.getElementById("totalQuantity").textContent = totalQuant.toString();
    document.getElementById("totalPrice").textContent = totalPr.toString();
    /* pour chaque article de la page */
    for (let i=0; i<cartridge.length; i++) {
        fetch("http://localhost:3000/api/products/" + cartridge[i].id)//requête d'un article à l'API
            .then(getResData)//récup response
            .then(function(value){
                displayProduct(value, cartridge, i);//affichage
                listenChangeQuant(i, cartridge);//écoute quantité
                listenSupprArticle(i, cartridge);//écoute suppression
                displayQuantPrice(cartridge, i);//rafraichissement prix et quantité au besoin
            }) 
            .catch(errorReturn)//retour erreur
    }; 
};



/* ************************************ */
/* TRAITEMENT DU FORMULAIRE DE COMMANDE */
/* ************************************ */

/* ***************************** */
/* fonctions formulaire et envoi */
/* ***************************** */

/* test validité des données de formulaire avant collecte et envoi*/
function validForm() {
    /* tests données de formulaire avec expressions régulières  */    
    let varFirstName = document.getElementById("firstName");
    const regXvarFirstName = new RegExp(/^[a-zA-zÀ-ú]+$/);
    let varLastName = document.getElementById("lastName");
    const regXvarLastName = new RegExp(/^[a-zA-zÀ-ú-]+$/);
    let varAddress = document.getElementById("address");
    const regXvarAddress = new RegExp(/^[0-9a-zA-ZÀ-ú\s,-]+$/);
    let varCity = document.getElementById("city");
    const regXvarCity = new RegExp(/^[a-zA-z-]+$/);
    let varEmail = document.getElementById("email");
    const regXvarEmail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    let errorExist=false//initialisation témoin d'erreur
    if (regXvarFirstName.test(varFirstName.value)===false) {
        document.getElementById("firstName"+"ErrorMsg").innerText="Saisissez un "+document.querySelector("label[for='firstName']").innerText+ " valide";
        errorExist=true;//basculement de témoin sur erreur
    }
    else if (regXvarFirstName.test(varFirstName.value)===true) {
        document.getElementById("firstName"+"ErrorMsg").innerText="";//message d'erreur vide hors erreur
    };

    if (regXvarLastName.test(varLastName.value)===false) {
        document.getElementById("lastName"+"ErrorMsg").innerText="Saisissez un "+document.querySelector("label[for='lastName']").innerText+ " valide";
        errorExist=true;
    }
    else if (regXvarLastName.test(varLastName.value)===true) {
        document.getElementById("lastName"+"ErrorMsg").innerText="";
    };

    if (regXvarAddress.test(varAddress.value)===false) {
        document.getElementById("address"+"ErrorMsg").innerText="Saisissez une "+document.querySelector("label[for='address']").innerText+ " valide";
        errorExist=true;
    }
    else if (regXvarAddress.test(varAddress.value)===true) {
        document.getElementById("address"+"ErrorMsg").innerText="";
    };

    if (regXvarCity.test(varCity.value)===false) {
        document.getElementById("city"+"ErrorMsg").innerText="Saisissez un "+document.querySelector("label[for='city']").innerText+ " valide";
        errorExist=true;
    }
    else if (regXvarCity.test(varCity.value)===true) {
        document.getElementById("city"+"ErrorMsg").innerText="";
    };
    
    if (regXvarEmail.test(varEmail.value)===false) {
        document.getElementById("email"+"ErrorMsg").innerText="Saisissez un "+document.querySelector("label[for='email']").innerText+ " valide";
        errorExist=true;
    }
    else if (regXvarEmail.test(varEmail.value)===true) {
        document.getElementById("email"+"ErrorMsg").innerText="";
    };
    /* bilan des test*/
        /* nouvelle écoute en cas d'erreur */
    if (errorExist===true) {
        console.log("j'écoute à nouveau");
        listenOrderButton()//écoute
    }else{
        /* collecte et envoi si pas d'erreur*/
        collectData();
        sendPostOrder();
    }
}

/* collecte des données formulaire de la commande, constituer un objet de contact et un tableau de produits sachant que l'API ne gère pas encore les quantités et couleurs des commandes*/
function collectData() {
    
    contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value
    };
    products=[];
    let productId;
    for (let item of cartridge) {
      productId = item.id;
      products.push(productId);//collection des identifiants
    };
}

/* envoi de la commande vers l'API */
function sendPostOrder(){
    /* demande de confirmation */
    let conf=confirm("Félicitations!\nVous allez commander "+totalQuant+" canapé(s) pour la somme de "+totalPr+"€\nVeuillez confirmer");
    
    if (conf===false){
      //do nothing
    }else if (conf===true){
        fetch("http://localhost:3000/api/products/order", {//requête API d'envoi de commande asynchrone
            method: "POST",
            headers: {
            "Accept": "application/json; charset=UTF-8",
            "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({contact, products})
        })
        .then(function(res) {//test de réponse de promise après retour pour obtenir l'id de commande
            if (res.ok) {
                return res.json();
            } 
        })
        .then(function(value) {//redirection sur la page de confirmation avec affichage d'un identifiant de commande après retour
            let urlRedirect="./confirmation.html";
            window.location=urlRedirect + "?id=" + value.orderId//id de commande dans l'url de page
        })
        .then(function removecartridge() {//réinitialisation du panier pour ne pas relancer la même commande et effacer le ls
            cartridge=[];
            localStorage.removeItem("cartridge");
        })
        .catch(errorReturn);
    }
}



/* ******************************* */
/* code global formulaire et envoi */
/* ******************************* */
const buttonOrder = document.getElementById("order"); //récup de l'élt sur lequel écouter

/* écoute du bouton de commande */
function listenOrderButton() {
    /* définition et écoute du bouton d'envoi */
    buttonOrder.addEventListener('click', treatOrder);

    function treatOrder(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        validForm();
    }
}


/* ***************************** */
/* CODE GLOBAL PRINCIPAL DE PAGE */
/* ***************************** */

function mainPage(){
  globalDisplay();
  listenOrderButton()
}

mainPage()

