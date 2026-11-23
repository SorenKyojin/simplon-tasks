const byId = (id) => document.getElementById(id);

const boutonAjouter = byId("ajouter");
const form = byId("form");

let champTitre = byId("titre");
let champDescription = byId("description");
let champStatut = byId("statut");
let erreur = byId("erreur");

const STATUTS = {
  "à faire": "bleu",
  "en cours": "orange",
  terminé: "vert",
  bloquée: "rouge",
};

const TACHE_STORAGE = "tache";
let taches = [];

function saveToStorage() {
  localStorage.setItem(TACHE_STORAGE, JSON.stringify(taches));
}

function loadStorage() {
  taches = JSON.parse(localStorage.getItem(TACHE_STORAGE)) || [];
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
});

function resetForm() {
  form.reset();
  form.classList.toggle("cache");
  erreur.classList.remove("erreur");
  erreur.textContent = "";
}

function ajouterTache(titre, description, statut) {
  const tache = {
    id: Date.now(),
    titre,
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
console.log(taches);
