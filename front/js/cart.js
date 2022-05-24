/* *********************** */
/*      page panier        */
/* manipulations du panier */
/* *********************** */

/* initialisations */

let cartridge = [];
let cartridgeString;
let parentSection;
let dataIdVar = "";
let dataIdStor = "";
let price; 
let imgsrc = "";
let kanapName = "";
let imgAlt = "";
/* let cartvalue = []; */
/* création fonction pour extraire (pour chaque cellule du tableau panier) l'objet produit en parcourant le tableau et insérer les éléments dans le DOM pour mettre à jour l'affichage*/

function dispAllArticles() {//parametre cartridge facultatif
  cartridgeString = localStorage.getItem("cartridge");
  cartridge = JSON.parse(cartridgeString);
  /* dataIdStor = cartridge[i].id */
  console.log(cartridge);//verif
  totalQuant = 0;
  totalPr = 0;
  parentSection = document.getElementById("cart__items");
  parentSection.innerHTML = "";//initialisation de l'affichage des articles
  document.getElementById("totalQuantity").textContent = totalQuant.toString();
  document.getElementById("totalPrice").textContent = totalPr.toString();

  /* pour chaque article de la page */
  for (let i=0; i<cartridge.length; i++) {
    dataIdStor=cartridge[i].id
    /* requête API (on a évité le stockage local du prix) */
    fetch("http://localhost:3000/api/products/" + dataIdStor)
      .then(function(res) {
        if (res.ok) {
          return res.json();
        }
      })
        /* mise à disposition des détails du produit */
        .then(function(value) {

          /* affectations attributs*/
          console.log("value du fetch:", value);
          price = value.price;
          imgsrc = value.imageUrl; console.log("imgsrc", imgsrc);
          kanapName = value.name;
          imgAlt = value.altTxt + ", " + kanapName;
          dataIdStor = value._id;
          /* création d'un nouvel article pour le produit */
          let newArticle = document.createElement("article");
          newArticle.classList.add("cart__item");
          newArticle.id = 'a' + i;
          newArticle.dataset.id = dataIdStor;
          newArticle.dataset.color = cartridge[i].color;

          /* remplissage de l'article */
          newArticle.innerHTML = '<div class="cart__item__img">'+
            '<img src = ' + imgsrc +'>'+
          '</div>'+
          '<div class="cart__item__content">'+
            '<div class="cart__item__content__description">'+
              '<h2>' + kanapName + '</h2>'+
              '<p>' + cartridge[i].color + '</p>'+
              '<p>' + price + '€</p>'+
            '</div>'+
            '<div class="cart__item__content__settings">'+
              '<div class="cart__item__content__settings__quantity">'+
                '<p>Qté : </p>'+
                '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' + cartridge[i].quantity +'">'+
              '</div>'+
              '<div class="cart__item__content__settings__delete">'+
                '<p class="deleteItem">Supprimer</p>'+
              '</div>'+
            '</div>'+
          '</div>';

          //console.log(cartridge[i].id, cartridge[i].color, " est affiché");

          /* affichage de l'article */
          parentSection.appendChild(newArticle);
          
          /* écoute de l'input correspondant */
          listenChangeQuant(i);//!!! on écoute de préférence dès la création de l'élément
          listenSupprArticle(i);
          /* calcul mis à jour de quantité et prix total */
          
        })
        /* mise à jour de l'affichage quantité et prix total */
        .then (function() {
          totalQuant += parseInt(cartridge[i].quantity, 10);
          //console.log("qté boucle", totalQuant);
          totalPr += (price*parseInt(cartridge[i].quantity, 10));
          //console.log(totalPr);
          document.getElementById("totalQuantity").textContent = totalQuant.toString();console.log("qté total affiché");
          document.getElementById("totalPrice").textContent = totalPr.toString();
        })
      .catch(function(err) {//récupération d'erreur si échec de réponse de la promesse (attention pas de then ensuite)
        console.log(err);
      });
  };
}

dispAllArticles();//actualiser les données affichées

/* fonction d'écoute de quantité d'article */
function listenChangeQuant(i) {
  let eltquant = document.querySelector('#a'+ i +' input[name="itemQuantity"]');
  /* cartvalue = cartridge; */ //représentation de cartridge[i] à manipuler.(problème d'index)
  eltquant.addEventListener("change", changeQuantity);

  function changeQuantity(eventq) {//changement de quantité d'un article
    /* eventq.preventDefault();
    eventq.stopPropagation();  */       
    //attention verifier boucle fourchette 0-100?
    if (eventq.target.value >= 1 && eventq.target.value <= 100) {
      cartridge[i].quantity = eventq.target.value;
      console.log("value changée", cartridge[i]);
      console.log("nouveau panier ", cartridge);
      /* cartridge = cartvalue; */
      console.log("nouveau panier cartridge", cartridge);
      localStorage.setItem("cartridge", JSON.stringify(cartridge));//envoyer au localstorage
      dispAllArticles();
     
    }else{
      alert("Veuillez entrer ou sélectionner un nombre entre 1 et 100");
    }  
  }

}

/* fonction d'écoute de suppression d'article */
function listenSupprArticle(i) {
  let eltSuppr = document.querySelector('#a'+ i +' .cart__item__content__settings__delete .deleteItem');

  /* let cartvalue = cartridge; */
  eltSuppr.addEventListener("click", deleteArticle);

  function deleteArticle() {//suppression d'article
    cartridge.splice(i,1);
    /* cartridge = cartvalue; */
    localStorage.setItem("cartridge", JSON.stringify(cartridge));
    dispAllArticles();
  };
};

/* ************************************ */
/* traitement du formulaire de commande */
/* ************************************ */

//penser au message d'erreur
//regex pour vérifier, penser à tester
//https://www.pierre-giraud.com/javascript-apprendre-coder-cours/introduction-expression-reguliere-rationnelle/

//Pour les routes POST, l’objet contact envoyé au serveur doit contenir les champs firstName, lastName, address, city et email. Le tableau des produits envoyé au back-end doit être un array de strings product-ID. Les types de ces champs et leur présence doivent être validés avant l’envoi des données au serveur.


/* définition et écoute du bouton d'envoi */
const buttonOrder = document.getElementById("order"); //récup de l'élt sur lequel écouter
buttonOrder.addEventListener('click', postOrder);//écoute

/* fonction globale d'envoi de commande */
function postOrder(event) {

  event.preventDefault();
  event.stopPropagation();
  let contact;
  let products = [];
  /* test validité des données de formulaire*/

  varFirstName = document.getElementById("firstName");
  let regXvarFirstName = new RegExp(/^[a-zA-zÀ-ú]+$/);
  varLastName = document.getElementById("lastName");
  let regXvarLastName = new RegExp(/^[a-zA-zÀ-ú-]+$/);
  varAddress = document.getElementById("address");
  let regXvarAddress = new RegExp(/^[0-9a-zA-ZÀ-ú\s,-]+$/);
  varCity = document.getElementById("city");
  let regXvarCity = new RegExp(/^[a-zA-z-]+$/);
  varEmail = document.getElementById("email");
  let regXvarEmail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);


  if (regXvarFirstName.test(varFirstName.value)===false) {
      document.getElementById("firstName"+"ErrorMsg").innerText="Saisissez un "+document.querySelector("label[for='firstName']").innerText+ " valide";
      console.log("firstName pas bon");
  }
  else if (regXvarLastName.test(varLastName.value)===false) {
      document.getElementById("lastName"+"ErrorMsg").innerText="Saisissez un "+document.querySelector("label[for='lastName']").innerText+ " valide";
      console.log("lastName pas bon");
  }
  else if (regXvarAddress.test(varAddress.value)===false) {
      document.getElementById("address"+"ErrorMsg").innerText="Saisissez une "+document.querySelector("label[for='address']").innerText+ " valide";
      console.log("address pas bon");
  }
  else if (regXvarCity.test(varCity.value)===false) {
      document.getElementById("city"+"ErrorMsg").innerText="Saisissez un "+document.querySelector("label[for='city']").innerText+ " valide";
      console.log("firstName pas bon");
  }
  else if (regXvarEmail.test(varEmail.value)===false) {
      document.getElementById("email"+"ErrorMsg").innerText="Saisissez un "+document.querySelector("label[for='email']").innerText+ " valide";
      console.log("email pas bon");
  }else{
  
 
  /* collecte des données formulaire de la commande, constituer un objet de contact et un tableau de produits sachant que l'API ne gère pas encore les quantités et couleurs des commandes*/
  function collectOrder(document) {
    contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value
    };
    
    let productId;
    for (let item of cartridge) {
      productId = item.id;
      
      products.push(productId);
      
    };
    console.log("products", products);
  }
  collectOrder(document);

  /* envoi de la commande vers l'API */
  function sendOrder(contact, products) {//
    fetch("http://localhost:3000/api/products/order", {//requête API d'envoi de commande asynchrone
      method: "POST",
      headers: {
        "Accept": "application/json; charset=UTF-8",
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({contact, products})
    })
      .then(function(res) {//test de réponse de promise après retour
        if (res.ok) {
          return res.json();
        } 
      })
        .then(function redirect(value) {//redirection sur la page de confirmation avec id après retour
          urlRedirect="./confirmation.html";
          window.location=urlRedirect + "?id=" + value.orderId;
        })
      .catch(function(err) {//récupération d'erreur si échec de réponse de la promesse (attention pas de then ensuite)
        console.log(err);
      });
    }
    sendOrder(contact, products);
};
}


 

 