let cartridge = [];
let cartridgeString = localStorage.getItem("cartridge");
cartridge = JSON.parse(cartridgeString);
  



/* extraire pour chaque cellule l'objet produit en parcourant le tableau et insérer les éléments dans le DOM*/

function dispAllArticles() {//cartridge facultatif
  
  console.log(cartridge);
  let totalQuant = 0;
  let totalPr = 0;

  
  let parentSection = document.getElementById("cart__items");
  parentSection.innerHTML = "";
  for (let i=0; i<cartridge.length; i++) {
      let newArticle = document.createElement("article");
      newArticle.classList.add("cart__item");
      newArticle.id = 'a' + i;
      newArticle.dataset.id = cartridge[i].id;
      newArticle.dataset.color = cartridge[i].color;

      newArticle.innerHTML = '<div class="cart__item__img">'+
      '<img src = ' + cartridge[i].imgsrc +'>'+
    '</div>'+
    '<div class="cart__item__content">'+
      '<div class="cart__item__content__description">'+
        '<h2>' + cartridge[i].kanapName + '</h2>'+
        '<p>' + cartridge[i].color + '</p>'+
        '<p>' + cartridge[i].price + '€</p>'+
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
    
    
    parentSection.appendChild(newArticle);
    
    totalQuant += parseInt(cartridge[i].quantity, 10);
    console.log("qté boucle", totalQuant);
    totalPr += (cartridge[i].price*cartridge[i].quantity);
    console.log(totalPr);
    document.getElementById("totalQuantity").textContent = totalQuant.toString();

    document.getElementById("totalPrice").textContent = totalPr.toString();

  }
  
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
    e.target.style.backgroundColor = bgChange();
  }
}
 */


let eltquant = Array.from(document.querySelectorAll(".itemQuantity"));
console.log(eltquant);

let itemi = {};
for (let i = 0; i<cartridge.length; i++) {
  console.log("boucle modif", i);
  eltquant[i].addEventListener("change", changeQuantity);
  itemi = cartridge[i];
  function changeQuantity(eventq) {
    console.log("value changée", eventq.target.value);
    /* eventq.preventDefault();
    eventq.stopPropagation();  */       
    
    /* cartridge[i].quantity = eventq.target.value; */
    /* changeobj = cartridge[i]; */
    //attention verifier boucle fourchette 0-100
    itemi.quantity = eventq.target.value;
    console.log(itemi);
    /* cartridge[i] = changeobj; */
    console.log("nouveau panier", cartridge);
    localStorage.setItem("cartridge", JSON.stringify(cartridge));//envoyer au localstorage
    /* cartridgeString = localStorage.getItem("cartridge");
    cartridge = JSON.parse(cartridgeString); */
    /* dispAllArticles(); */
  };
  cartridge[i] = itemi;
}

 

    