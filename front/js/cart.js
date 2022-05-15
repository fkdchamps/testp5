/* let cartridge = [];
let cartridgeString = localStorage.getItem("cartridge");
cartridge = JSON.parse(cartridgeString); */
let cartridge = [];
let cartridgeString/*  = localStorage.getItem("cartridge") */;
/* let totalQuant = 0;
let totalPr = 0; */
let parentSection/*  = document.getElementById("cart__items") */;
let id = "";
let price; 
let imgsrc = "";
let kanapName = "";
let imgAlt = "";
/* extraire pour chaque cellule l'objet produit en parcourant le tableau et insérer les éléments dans le DOM*/

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

  

  for (let i=0; i<cartridge.length; i++) {

    id = cartridge[i].id;
    
    fetch("http://localhost:3000/api/products/" + id)
      .then(function(res) {
        if (res.ok) {
          return res.json();
        }
      })
        /* mise à disposition des détails du produit */
        .then(function(value) {
          /* affectations attributs*/
          /* let productId = value._id; */
          console.log("value du fetch:", value);
          price = value.price;
          imgsrc = value.imageUrl; console.log("imgsrc", imgsrc);
          kanapName = value.name;
          imgAlt = value.altTxt + ", " + kanapName;
          /* let descript = value.description; */
  
          /* implementer l'image du produit */
          /* const eltDivImg = document.querySelector("section.item .item__img");
          eltDivImg.innerHTML = "<img src=" + imgsrc + " alt=" + imgAlt + "></img>"; */
  
          /* implementer le titre */
          /*  const eltTitle = document.getElementById("title");
          eltTitle.innerHTML = kanapName; */
  
          /* implementer le prix */
          /* const eltPrice = document.getElementById("price");
          eltPrice.innerHTML = price; */
  
          /* description */
          /* const eltDescription = document.getElementById("description");
          eltDescription.innerHTML = descript; */
  
          /* couleurs */
          /* const colors = value.colors; */
          /* const options = document.getElementById("colors");
          for (let color of colors) {
            let option = document.createElement("option");
            option.value = color;
            option.label = color;
            options.appendChild(option);
          } */
          let newArticle = document.createElement("article");
          newArticle.classList.add("cart__item");
          newArticle.id = 'a' + i;
          newArticle.dataset.id = cartridge[i].id;
          newArticle.dataset.color = cartridge[i].color;

          newArticle.innerHTML = '<div class="cart__item__img">'+
            '<img src = ' + /* cartridge[i]. */imgsrc +'>'+
          '</div>'+
          '<div class="cart__item__content">'+
            '<div class="cart__item__content__description">'+
              '<h2>' + /* cartridge[i]. */kanapName + '</h2>'+
              '<p>' + cartridge[i].color + '</p>'+
              '<p>' + /* cartridge[i]. */price + '€</p>'+
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
          console.log(cartridge[i].id, cartridge[i].color, " est affiché");
          
          parentSection.appendChild(newArticle);
          
          listenChangeQuant(i);//!!!!!!!!!!!!!
        
          /* calcul des qtés et prix total */
          totalQuant += parseInt(cartridge[i].quantity, 10);
          console.log("qté boucle", totalQuant);
          totalPr += (/* cartridge[i]. */price*cartridge[i].quantity);
          console.log(totalPr);
        })
        .then (function() {
  
          document.getElementById("totalQuantity").textContent = totalQuant.toString();console.log("qté total affiché");

          document.getElementById("totalPrice").textContent = totalPr.toString();
        })
      .catch(function(err) {//récupération d'erreur si échec de réponse de la promesse
        console.log(err);
      });
  };
  /* affichage des qtés et prix total */
  /* document.getElementById("totalQuantity").textContent = totalQuant.toString();

  document.getElementById("totalPrice").textContent = totalPr.toString(); */
}
dispAllArticles();//facultatif param


/* ******************************* */
/* possibilité modification panier */
/* ******************************* */

/* pour chaque article( id=n) de la page document:
  ajout ecouteur sur
    -quantité et au changement modifier la value et le tableau panier chargé en cours(variable cartridge)
    -le lien supprimer et au changement supprimer l'article dans la variable cartridge*/

//traitement de modif de quantité

/* console.log(cartridge);
//la suite à enlever ?
let eltquant = "0";
let eltsuppr = undefined;
for (let i=0; i<cartridge.length; i++) {
      eltquant = document.querySelector('#a' + i.toString(10) + ' .itemQuantity');
      console.log(eltquant);
      eltquant.addEventListener("change", function(eventq) {
        console.log("debut de fonction modif");
        eventq.preventDefault();
        eventq.stopPropagation();        
        eltquant.value = eventq.target.value;
        console.log(eventq.target.value);
        cartridge[i].quantity = eltquant.value;
        console.log(cartridge[i] + "quantité changée");
        localStorage.setItem("cartridge", JSON.stringify(cartridge));//envoyer au localstorage
        
        
      });
      eltsuppr = document.querySelector('#a' + i.toString(10) + ' .deleteItem');

      eltsuppr.addEventListener("click", function() {
        eventq.preventDefault();
        eventq.stopPropagation(); 
        cartridge = cartridge.splice(i,1);//modif tableau js
        console.log("splice" + cartridge);
        localStorage.setItem("cartridge", JSON.stringify(cartridge));//envoyer au localstorage
        
      });
      dispAllArticles();//rafraichir l'affichage
}
 */
  
/* voir cet exemple et revoir : https://developer.mozilla.org/fr/docs/Learn/JavaScript/Building_blocks/Events

var divs = document.querySelectorAll('div');

for (var i = 0; i < divs.length; i++) {
  divs[i].onclick = function(e) {
    e.target.property = ...;
  }
}
 */

function listenChangeQuant(i) {
  let eltquant = document.querySelector('#a'+ i +' input[name="itemQuantity"]');
  console.log("tableau recap de liste d'input qté :", eltquant);

  let cartvalue = cartridge; //représentation de cartridge[i] à manipuler.(pas réussi à manipuler directement)

  console.log("boucle modif", i);
  eltquant.addEventListener("change", changeQuantity);


  function changeQuantity(eventq) {
    console.log("incrément", i);
    /* console.log("value changée", eventq.target.value); */
    /* eventq.preventDefault();
    eventq.stopPropagation();  */       

    /* cartridge[i].quantity = eventq.target.value; */
    /* changeobj = cartridge[i]; */
    //attention verifier boucle fourchette 0-100
    cartvalue[i].quantity = eventq.target.value;
    console.log("value changée", cartvalue[i]);
    /* cartridge[i] = changeobj; */
    console.log("nouveau panier cartvalue", cartvalue);
    cartridge = cartvalue;
    console.log("nouveau panier cartridge", cartridge);
    localStorage.setItem("cartridge", JSON.stringify(cartridge));//envoyer au localstorage
    /* cartridgeString = localStorage.getItem("cartridge");
    cartridge = JSON.parse(cartridgeString); */
    dispAllArticles();
  }

}




 

    