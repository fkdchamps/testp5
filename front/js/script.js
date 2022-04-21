/* requete produits */
const productsPromise = fetch("http://localhost:3000/api/products");
  productsPromise.then(function(res) {
    if (res.ok) {
      const products = res.json();
      return products;
      
    }
  })
  .then(function(value) {
    let i=0
    for (let product of value) {
      console.log(product);
      i++;
      console.log(i);      
      let productId = product._id;
      console.log(productId);
      let articleId = "article" + i;
      console.log(articleId);
      let imgsrc = product.imageUrl;
      console.log(imgsrc);
      let kanapName = product.name;
      console.log(kanapName);
      let imgAlt = "" + product.altTxt + ", " + kanapName;
      console.log(imgAlt);
      let descript = product.description;
      console.log(descript);
      let newAnchor = document.createElement("a");
      newAnchor.href = "./product.html?id=" + productId;
      newAnchor.id = "anchor" + i;
      const parentSection = document.getElementById("items");
      parentSection.appendChild(newAnchor);
      let newArticle = document.createElement("article");
      newArticle.id = "article" + i;
      newArticle.innerHTML = "<img src=" + imgsrc + " alt=" + imgAlt + ">" +
      "<h3 class='productName'>" + kanapName + "</h3>" +
      "<p class='productDescription'>" + descript + "</p>";
      newAnchor.appendChild(newArticle);
    }
  })
  .catch(function(err) {
    console.log("Une erreur est survenue")
  });
  