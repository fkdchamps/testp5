/* requete produits et récupération au format json*/
fetch("http://localhost:3000/api/products")//requete de promesse
  .then(function(res) {//.then va enchainer la tache de fonction anonyme au retour la promesse, avec paramètre=reponse(évite de se faire doubler par l'asynchronisme)
    if (res.ok) {//vérifie true si succès de réponse
      return res.json();//retourne la méthode json de cette réponse*********?
    }
  }).then(function(ArrayProduitsJson) {/* récupération et affichage des produits */ //deuxième enchainement de fonction pour extraire les données propres à chaque produit
      let i=0//translation de l'index des objets du tableau transposé à partir de 1
      for (let product of ArrayProduitsJson) {
        i++;//on incrémente l'index

        /* on affecte chaque donnée à une variable au nom parlant (étape à sauter avec l'expérience) */  
        let productId = product._id;
        let articleIndex = i;
        let imgsrc = product.imageUrl;
        let kanapName = product.name;
        let imgAlt = "" + product.altTxt + ", " + kanapName;
        let descript = product.description;

        /* création de la balise <a> */
        let newAnchor = document.createElement("a");//on crée la balise
        newAnchor.href = "./front/html/product.html?id=" + productId;//on attribue l'url de référence du lien
        newAnchor.id = "anchor" + articleIndex;//on affecte un id# unique à cette balise

        /* affectation de la balise <a> dans le html */
        const parentSection = document.getElementById("items");//on va chercher le bloc parent
        parentSection.appendChild(newAnchor);//on injecte la balise html

        /* creation, identification#, implementation, affectation dans son parent<a>, de l'article du produit */
        let newArticle = document.createElement("article");
        newArticle.id = "article" + articleIndex;
        newArticle.innerHTML = "<img src=" + imgsrc + " alt=" + imgAlt + ">" +
        "<h3 class='productName'>" + kanapName + "</h3>" +
        "<p class='productDescription'>" + descript + "</p>";
        newAnchor.appendChild(newArticle);
        /* on a maintenant un nouveau produit affiché*/
      }
      /* on a maintenant en principe tous les produits affichés */
    })
  .catch(function(err) {//récupération d'erreur si échec de réponse de la promesse
    console.log("Une erreur est survenue");
  })
  