const getUrl = document.location.href;
const url = new URL(getUrl);
const id = url.searchParams.get("id");

/* requete du produit */
const productPromise = fetch("http://localhost:3000/api/products/" + id);
  productPromise.then(function(res) {
    if (res.ok) {
      const product = res.json();
      return product;
      
    }
  })
  .then(function(value) {
    let productId = value._id;
    console.log(productId);
    let price = value.price;
    let imgsrc = value.imageUrl;
    console.log(imgsrc);
    let kanapName = value.name;
    console.log(kanapName);
    let imgAlt = value.altTxt + ", " + kanapName;
    console.log(imgAlt);
    let descript = value.description;
    console.log(descript);
    const eltDivImg = document.querySelector("section.item .item__img");
    console.log(eltDivImg);
    eltDivImg.innerHTML = "<img src=" + imgsrc + " alt=" + imgAlt + "></img>"
    const eltTitle = document.getElementById("title");
    eltTitle.innerHTML = kanapName;
    const eltPrice = document.getElementById("price");
    eltPrice.innerHTML = price;
    const eltDescription = document.getElementById("description");
    eltDescription.innerHTML = descript;
    const colors = value.colors;
    const options = document.getElementById("colors");
    for (let color of colors) {
      console.log(color);
      let option = document.createElement("option");
      option.value = color;
      option.label = color;
      options.appendChild(option);
      
    }
  })