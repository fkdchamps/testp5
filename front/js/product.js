/* récupération de l'identifiant du produit dans l' url*/

const urlObj = new URL(document.location.href);//on transforme la référence d'url en Objet URL exploitable par attributs
const id = urlObj.searchParams.get("id");//on isole l'attribut d'identification

/* requete du produit */
fetch("http://localhost:3000/api/products/" + id)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
    /* mise à disposition des détails du produit */
    .then(function(value) {
      /* affectations attributs*/
      let productId = value._id;
      let price = value.price;
      let imgsrc = value.imageUrl;
      let kanapName = value.name;
      let imgAlt = value.altTxt + ", " + kanapName;
      let descript = value.description;

      /* implementer l'image du produit */
      const eltDivImg = document.querySelector("section.item .item__img");
      eltDivImg.innerHTML = "<img src=" + imgsrc + " alt=" + imgAlt + "></img>";

      /* implementer le titre */
      const eltTitle = document.getElementById("title");
      eltTitle.innerHTML = kanapName;

      /* implementer le prix */
      const eltPrice = document.getElementById("price");
      eltPrice.innerHTML = price;

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
    })
    
  .catch(function(err) {//récupération d'erreur si échec de réponse de la promesse
    console.log(err);
  })
  
/****************************** */
/* envoi de l'article au panier */
/****************************** */


/* au clic sur bouton on récupère l'id, la quantité et la couleur en un objet produit*/
  //la couleur ici : ligne 67 <select name="color-select" id="colors">
  //la quantité ici : ligne 76 <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
  //l'id dans la constante id du début
  //penser à https://openclassrooms.com/fr/courses/5543061-ecrivez-du-javascript-pour-le-web/5578181-recuperez-des-donnees-utilisateurs-avec-les-evenements#/id/r-5591885

const buttonCart = document.getElementById("addToCart"); //récup de l'élt sur lequel écouter
buttonCart.addEventListener('click', function(event) { // On écoute l'événement click, et au clic on exécute la fonction
  /* event.stopPropagation(); *///facultatif ici
  /* récup des propriétés */
  let color = document.getElementById("colors").value;
  let quantity = parseInt(document.getElementById("quantity").value);
  //la const id est déjà au début du code
  /* création panier-tableau et produit en cours */
  let cartridge = [];
  let product = {color: color, quantity: quantity, id: id};
  /* vérif quantité dans les normes admissibles */
  if (product.quantity >= 1 && product.quantity <= 100 && product.color != "") {
    /* vérif si le panier n'existe pas pour le créer et mettre le premier produit */
    if (!localStorage.getItem("cartridge")) {
      cartridge = [product];
      localStorage.setItem("cartridge", JSON.stringify(cartridge));
    /* sinon ajout du produit au panier */
    }else{
      let cartridgeString = localStorage.getItem("cartridge");//le panier du localstorage est importé sous forme de chaine
      cartridge = JSON.parse(cartridgeString);//puis transposé en objet json
      /* test de présence de l'article dans le panier existant par comparaison de propriété produit avec chaque cellule de panier */
      let already = false;//témoin unique de fin de boucle
      for (let i in cartridge) {
        console.log(i);
        if (product.id === cartridge[i].id && product.color === cartridge[i].color) {//si produit déjà présent
          cartridge[i].quantity += product.quantity;//pousser seulement sa propriété quantité
          already = true;//témoigner de cette présence
        }         
      }
      if (already == false) {//si pas déjà présent, pousser l'objet produit dans panier
        cartridge.push(product);
      }
      /* localStorage.removeItem("cartridge"); */
      localStorage.setItem("cartridge", JSON.stringify(cartridge));
    }
  }
})

/* (on vérifie si il existe le tableau panier dans le local storage, sinon on le crée), et on l'importe en le traduisant dans une  variable tableau: =destringifier :-) */

/* on  vérifie si un objet au même identifiant que le produit choisi n'est pas déjà présent, si ok on ajoute l'objet produit en tant que nouvel index du tableau sinon rien */

/* on restringifie le tableau panier et on le reexporte dans le localstorage */


/* un exemple de code à transposer pour notre tableau d'objets */
/* var membres = [];
function ajouter() {
  var nom = document.getElementById('nom').value;
  var prenom = document.getElementById('prenom').value;
  var ville = document.getElementById('ville').value;
  var statut = document.getElementById('stat').value;
  var mail = document.getElementById('mail').value;
  if (nom === '' || prenom === '')
    alert('Nom et prenom sont obligatoires');
  else {
    membres = JSON.parse(localStorage.getItem('membres'));
    membres.push({
      Nom: nom,
      Prenom: prenom,
      DateDeNaissance: '11/01/1911',
      Genre: 'Femme',
      Statut: statut,
      VillePays: ville,
      Courriel: mail
    });
    localStorage.setItem('membres', JSON.stringify(membres));
    console.log(membres);
  }
} */
/* let article = "article" + id;
let param = {id, quantity, color};
if localStorage.getItem(article) = undefined
  localStorage.setItem(article, JSON.stringify(param));
 */
