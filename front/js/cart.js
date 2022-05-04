/* recuperer le panier */
let cartridgeString = localStorage.getItem("cartridge");
cartridge = JSON.parse(cartridgeString);
console.log(cartridge);


/* extraire pour chaque cellule l'objet produit en parcourant le tableau et insérer les éléments dans le DOM*/
let i = 0;
for (let product of cartridge) {
    i++;
    
    
    let newArticle = document.createElement("article");
    newArticle.classList.add("cart__item");
    newArticle.dataset.id = product.id;
    newArticle.dataset.color = product.color;

    newArticle.innerHTML = '<div class="cart__item__img">'+
    '<img src = ' + product.imgsrc +'>'+
  '</div>'+
  '<div class="cart__item__content">'+
    '<div class="cart__item__content__description">'+
      '<h2>' + product.kanapName + '</h2>'+
      '<p>' + product.color + '</p>'+
      '<p>' + product.price + '€</p>'+
    '</div>'+
    '<div class="cart__item__content__settings">'+
      '<div class="cart__item__content__settings__quantity">'+
        '<p>Qté : </p>'+
        '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' + product.quantity +'">'+
      '</div>'+
      '<div class="cart__item__content__settings__delete">'+
        '<p class="deleteItem">Supprimer</p>'+
      '</div>'+
    '</div>'+
  '</div>';
  let parentSection = document.getElementById("cart__items");
  parentSection.appendChild(newArticle);
  
  
    
}

