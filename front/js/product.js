/* ************** */
/*  PAGE PRODUIT  */
/* ************** */

  /* ********************** */
  /* 1) affichage produit   */
  /* ********************** */

    /* ************** */
    /* 1.1) fonctions */
    /* ************** */

//délocalisations variables
let imgsrc;
let kanapName;
let imgAlt;
let id;

/* récupération de l'identifiant du produit dans l' url de la page produit*/
function getId(){
  const urlObj = new URL(document.location.href);//on transforme la référence d'url en Objet URL exploitable par attributs
  id = urlObj.searchParams.get("id");//on isole l'attribut d'identification
}

/* fonction de récupération de promise */
function getResData(res) {
  if (res.ok) {//vérifie true si succès de réponse
      return res.json();//retourne la méthode json de cette réponse
  }
} 

/* fonction d'affichage du produit */
function displayProduct(value) {
  /* affectations attributs*/
  /* let productId = value._id; */
  /* price = value.price; */
  imgsrc = value.imageUrl;
  kanapName = value.name;
  imgAlt = value.altTxt + ", " + kanapName;
  let descript = value.description;
  /* implementer l'image du produit */
  const eltDivImg = document.querySelector("section.item .item__img");
  eltDivImg.innerHTML = "<img src=" + imgsrc + " alt=" + imgAlt + "></img>";
  /* implementer le titre */
  const eltTitle = document.getElementById("title");
  eltTitle.innerHTML = kanapName;
  /* implementer le prix */
  const eltPrice = document.getElementById("price");
  eltPrice.innerHTML = value.price;
  /* description */
  const eltDescription = document.getElementById("description");
  eltDescription.innerHTML = descript;
  /* couleurs */
  const colors = value.colors;
  const options = document.getElementById("colors");
  for (let color of colors) {
    let option = document.createElement("option");
    option.value = color;
    option.label = color;
    options.appendChild(option);
  }
}

/* fonction de retour d'erreur */
function errorReturn(err) {//récupération d'erreur si échec de réponse de la promesse
  console.log("Une erreur est survenue");
  console.log(err);
}
    /* ********************************** */
    /* 1.2) fonction globale d'affichage  */
    /* ********************************** */

function DisplayContent(){
  getId();//récup id ou
  fetch("http://localhost:3000/api/products/" + id)//requête produit
    .then(getResData)//récup response
    .then(displayProduct)//affichage
    .catch(errorReturn)//retour erreur
}


  /******************************************* */
  /* 2) écoute et envoi de l'article au panier */
  /******************************************* */
   
    /* ************** */
    /* 2.1) fonctions */
    /* ************** */

/* ajout du produit au panier */

function addProduct(color, quantity, id) {
  product = {color: color, quantity: quantity, id: id};
  /* vérif si le panier n'existe pas pour le créer et mettre le premier produit */
  if (!localStorage.getItem("cartridge")) {
    let cartridge = [product];//création d'un nouveau tableau constitué du contenu de product
    localStorage.setItem("cartridge", JSON.stringify(cartridge))
  }else{
    let cartridgeString = localStorage.getItem("cartridge");//le panier du localstorage est importé sous forme de chaine
    let cartridge = JSON.parse(cartridgeString);//puis transposé en objet json

    /* test de présence de l'article dans le panier existant par comparaison de propriété produit avec chaque cellule de panier */
    let already = false;//initialisation témoin de présence de produit de fin de boucle for
    for (let i in cartridge) {
      
      if (product.id === cartridge[i].id && product.color === cartridge[i].color) {//si produit déjà présent
        itsQuantity=parseInt(cartridge[i].quantity, 10);

        itsQuantity += parseInt(product.quantity, 10);//pousser seulement sa propriété quantité
        cartridge[i].quantity=itsQuantity.toString(10);
        already = true;//témoigner de cette présence
      }       
    }

    if (already == false) {//si pas déjà présent, pousser l'objet produit dans panier
      cartridge.push(product);
    }

    /* affectation panier dans localstorage */
    localStorage.setItem("cartridge", JSON.stringify(cartridge));
  };
}

/* vérifications des entrées d'interface utilisateur et ajout*/

function testInputs(color, quantity){
  if (!(quantity >= 1 && quantity <= 100)) {//vérification d'entrée utilisateur de quantité
    alert("Veuillez entrer ou sélectionner un nombre entre 1 et 100");
  }
  else if (!(color!="")) {//vérification d'entrée utilisateur de couleur
    alert("Veuillez sélectionner une couleur à l'aide du menu déroulant");
  }else{
    alert("Félicitations!\nVous avez ajouté "+quantity+" canapé(s) "+kanapName+" de couleur "+color+" à votre panier.");
    addProduct(color, quantity, id);
  }
}

    /* ************************************** */
    /* 2.2)fonction globale d'envoi au panier */
    /* ************************************** */

function SendOnClick() { /* envoi au panier */  
  let color = document.getElementById("colors").value;
  let quantity = document.getElementById("quantity").value;
  testInputs(color, quantity);
}


/* ********************** */
/* CODE GLOBAL DE LA PAGE */
/*   AFFICHAGE ET ECOUTE  */
/* ********************** */

DisplayContent();//affichage global du produit
const buttonCart = document.getElementById("addToCart"); //récup de l'élt sur lequel écouter
buttonCart.addEventListener('click', SendOnClick);// On écoute l'événement click, et on lui attribue une fonction d'envoi

