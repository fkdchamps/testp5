/* ******************** */
/* page de confirmation */
/* ******************** */

/* affichage de validation de commande avec numero unique */

const urlObj = new URL(document.location.href);//on transforme la référence d'url en Objet URL exploitable par attributs
const id = urlObj.searchParams.get("id");//on isole l'attribut d'identification
document.getElementById("orderId").textContent=id;//on place l'id dans la page pour l'annonce de validation de commande


