const byId = (id) => document.getElementById(id);

// DONNEES
const boutonAjouter = byId("ajouter");
const form = byId("form");

let champTitre = byId("titre");
let champDescription = byId("description");
let champStatut = byId("statut");
let erreur = byId("erreur");
let liste = byId("liste");

const STATUTS = {
  "à faire": "#3498db",
  "en cours": "#e67e22",
  terminé: "#27aE60",
  bloquée: "#e74c3c",
};

const TACHE_STORAGE = "tache";
let taches = [];

function saveToStorage() {
  localStorage.setItem(TACHE_STORAGE, JSON.stringify(taches));
}

function loadStorage() {
  taches = JSON.parse(localStorage.getItem(TACHE_STORAGE)) || [];
  return taches;
}

boutonAjouter.addEventListener("click", (e) => {
  form.classList.toggle("cache");
});

byId("btn-reset").addEventListener("click", resetForm);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let titre = champTitre.value;
  let description = champDescription.value || "Pas de description";
  let statut = champStatut.value;

  const message = valider(titre, statut);
  if (message !== "") {
    erreur.classList.add("erreur");
    erreur.textContent = message;
    return;
  }

  ajouterTache(titre, description, statut);
  //   modifierTache(titre, description, statut);

  saveToStorage();
  resetForm();
  afficherTache();
});

function supprimer(id) {
  taches = taches.filter((tache) => tache.id !== id);
  saveToStorage();
  afficherTache();
}

function createCarte(tache) {
  let div = createElem("div");
  div.classList.add("carte");
  div.style.borderLeft = `5px solid  ${tache.couleur}`;

  let h3 = createElem("h3", tache.titre);
  let span = createElem("span", tache.statut);
  span.style.backgroundColor = tache.couleur;
  let p = createElem("p", tache.description);
  let pDate = createElem(
    "p",
    `Créé le ${new Date(tache.createdAt).toLocaleDateString("fr-FR")}`,
  );

  let btnModif = createElem("button", "Modifier");
  let btnSup = createElem("button", "Supprimer");

  btnModif.addEventListener("click", () => {
    console.log("modif tache : ", tache.id);
  });

  btnSup.addEventListener("click", () => {
    supprimer(tache.id);
  });

  div.append(h3, span, p, pDate, btnModif, btnSup);

  return div;
}

function createElem(elem, content = "") {
  const el = document.createElement(elem);
  el.textContent = content;

  return el;
}

function afficherTache() {
  liste.innerHTML = "";

  taches.forEach((tache) => {
    liste.append(createCarte(tache));
  });
}

function resetForm() {
  form.reset();
  form.classList.toggle("cache");
  erreur.classList.remove("erreur");
  erreur.textContent = "";
}

function ajouterTache(titre, description, statut) {
  const tache = {
    id: Date.now(),
    titre, // titre: titre
    description,
    statut,
    createdAt: new Date().toISOString(),
    couleur: STATUTS[statut],
  };

  taches.push(tache);
}

function valider(titre, statut) {
  if (titre.trim() === "") return "Le titre est obligatoire !";

  if (!(statut in STATUTS)) return "Le statut n'existe pas valide !";

  return "";
}

// charger les tâches au chargement de la page!
loadStorage();
afficherTache();

console.log(loadStorage()[0].couleur);
