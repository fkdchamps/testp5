const urlObj = new URL(document.location.href);//on transforme la référence d'url en Objet URL exploitable par attributs
const id = urlObj.searchParams.get("id");//on isole l'attribut d'identification
document.getElementById("orderId").textContent=id;

/* le code source

Celui-ci devra être indenté et utiliser des commentaires en début de chaque fonction pour
décrire son rôle. Il devra également être découpé en plusieurs fonctions réutilisables
(nommées). Une fonction doit être courte et répondre à un besoin précis. Il ne faudrait pas
avoir de longues fonctions qui viendraient répondre à plusieurs besoins à la fois. Exemple : il
ne serait pas accepté de mettre une seule et unique fonction en place pour collecter, traiter
et envoyer des données. */

/* Validation des données
Pour les routes POST, l’objet contact envoyé au serveur doit contenir les champs firstName,
lastName, address, city et email. Le tableau des produits envoyé au back-end doit être un
array de strings product-ID. Les types de ces champs et leur présence doivent être validés
avant l’envoi des données au serveur. */

