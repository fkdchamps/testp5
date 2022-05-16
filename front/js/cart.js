/* initialisationns */

let cartridge = [];
let cartridgeString;
let parentSection;
let id = "";
let price; 
let imgsrc = "";
let kanapName = "";
let imgAlt = "";

/* création fonction pour extraire pour chaque cellule l'objet produit en parcourant le tableau et insérer les éléments dans le DOM pour mettre à jour l'affichage*/

function dispAllArticles() {//parametre cartridge facultatif
  cartridgeString = localStorage.getItem("cartridge");
  cartridge = JSON.parse(cartridgeString);
  console.log(cartridge);//verif
  totalQuant = 0;
  totalPr = 0;
  parentSection = document.getElementById("cart__items");
  parentSection.innerHTML = "";//initialisation de l'affichage des articles
  document.getElementById("totalQuantity").textContent = totalQuant.toString();
  document.getElementById("totalPrice").textContent = totalPr.toString();

  /* pour chaque article de la page */
  for (let i=0; i<cartridge.length; i++) {
    id = cartridge[i].id;
    /* requête API afin d'éviter le stockage local du prix */
    fetch("http://localhost:3000/api/products/" + id)
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

          /* création d'un nouvel article pour le produit */
          let newArticle = document.createElement("article");
          newArticle.classList.add("cart__item");
          newArticle.id = 'a' + i;
          newArticle.dataset.id = cartridge[i].id;
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
          totalQuant += parseInt(cartridge[i].quantity, 10);
          //console.log("qté boucle", totalQuant);
          totalPr += (price*cartridge[i].quantity);
          //console.log(totalPr);
        })
        /* mise à jour de l'affichage quantité et prix total */
        .then (function() {
  
          document.getElementById("totalQuantity").textContent = totalQuant.toString();console.log("qté total affiché");

          document.getElementById("totalPrice").textContent = totalPr.toString();
        })
      .catch(function(err) {//récupération d'erreur si échec de réponse de la promesse (attention pas de then ensuite)
        console.log(err);
      });
  };
}


dispAllArticles();//facultatif param


/* création de la fonction d'écoute de quantité d'article */
function listenChangeQuant(i) {
  let eltquant = document.querySelector('#a'+ i +' input[name="itemQuantity"]');
  console.log("tableau recap de liste d'input qté :", eltquant);

  let cartvalue = cartridge; //représentation de cartridge[i] à manipuler.(pas réussi à manipuler directement)

  console.log("boucle modif", i);
  eltquant.addEventListener("change", changeQuantity);


  function changeQuantity(eventq) {
    /* console.log("incrément", i); */
    /* console.log("value changée", eventq.target.value); */
    /* eventq.preventDefault();
    eventq.stopPropagation();  */       
    //attention verifier boucle fourchette 0-100?
    cartvalue[i].quantity = eventq.target.value;
    console.log("value changée", cartvalue[i]);
    console.log("nouveau panier cartvalue", cartvalue);
    cartridge = cartvalue;
    console.log("nouveau panier cartridge", cartridge);
    localStorage.setItem("cartridge", JSON.stringify(cartridge));//envoyer au localstorage
    
    dispAllArticles();
  }

}

/* création de la fonction d'écoute de suppression d'article */
function listenSupprArticle(i) {
  let eltSuppr = document.querySelector('#a'+ i +' .cart__item__content__settings__delete .deleteItem');

  let cartvalue = cartridge;
  eltSuppr.addEventListener("click", deleteArticle);

  function deleteArticle() {
    cartvalue.splice(i,1);
    cartridge = cartvalue;
    localStorage.setItem("cartridge", JSON.stringify(cartridge));
    dispAllArticles();
  };
};

 

    