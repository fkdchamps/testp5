/* récupération de l'identifiant du produit dans l' url*/

const urlObj = new URL(document.location.href);//on transforme la référence d'url en Objet URL exploitable par attributs
const id = urlObj.searchParams.get("id");//on isole l'attribut d'identification
function fetchKanap(id){
  let price = 0; //délocalisation
  /* requete du produit */
  let imgsrc
  let kanapName
  let imgAlt
  //id="?""
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
        price = value.price;
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
}
fetchKanap(id);
  
/****************************** */
/* envoi de l'article au panier */
/****************************** */


const buttonCart = document.getElementById("addToCart"); //récup de l'élt sur lequel écouter

buttonCart.addEventListener('click', function(event) { // On écoute l'événement click, et au clic on exécute la fonction
  /* event.stopPropagation(); *///facultatif ici
  /* récup des propriétés */
  let color = document.getElementById("colors").value;
  /* let quantity = parseInt(document.getElementById("quantity").value); */
  let quantity = document.getElementById("quantity").value;
  //la const id est déjà au début du code

  /* création panier-tableau et produit en cours */
  let cartridge = [];
  let product = {color: color, quantity: quantity, id: id/* , price: price, imgsrc: imgsrc, kanapName: kanapName, imgAlt: imgAlt */};

  /* vérif quantité dans les normes admissibles et implémentation de panier*/
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
        if (product.id === cartridge[i].id && product.color === cartridge[i].color) {//si produit déjà présent
          cartridge[i].quantity += product.quantity;//pousser seulement sa propriété quantité
          already = true;//témoigner de cette présence
        }         
      }

      if (already == false) {//si pas déjà présent, pousser l'objet produit dans panier
        cartridge.push(product);
      }

      /* affectation panier dans localstorage */
      localStorage.setItem("cartridge", JSON.stringify(cartridge));
    }
  }
})


