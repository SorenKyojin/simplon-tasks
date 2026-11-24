const byId = (id) => document.getElementById(id);

// DONNEES
const boutonAjouter = byId("ajouter");
const form = byId("form");

let champTitre = byId("titre");
let champDescription = byId("description");
let champStatut = byId("statut");
let champId = byId("idtache");
let erreur = byId("erreur");
let liste = byId("liste");
let btnFiltres = document.querySelectorAll("#filtres button");
let filtreSatut = "toutes";
let idTacheEnDep = null;

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
  let id = champId.value;
  let titre = champTitre.value;
  let description = champDescription.value || "Pas de description";
  let statut = champStatut.value;

  const message = valider(titre, statut);
  if (message !== "") {
    erreur.classList.add("erreur");
    erreur.textContent = message;
    return;
  }

  if (id) {
    modifierTache(id, titre, description, statut);
  } else {
    ajouterTache(titre, description, statut);
  }

  saveToStorage();
  resetForm();
  afficherTache();
});

function supprimer(id) {
  taches = taches.filter((tache) => tache.id !== id);
  saveToStorage();
  afficherTache();
}

function modifier(tache) {
  form.classList.remove("cache");
  champTitre.value = tache.titre;
  champId.value = tache.id;
  champDescription.value = tache.description;
  champStatut.value = tache.statut;
}

function modifierTache(id, titre, description, statut) {
  const tache = taches.find((t) => t.id == id);

  if (tache) {
    tache.titre = titre;
    tache.description = description;
    tache.statut = statut;
    tache.couleur = STATUTS[statut];
  }
}

function createCarte(tache) {
  let carte = createElem("div");
  carte.classList.add("carte");
  carte.style.borderLeft = `5px solid  ${tache.couleur}`;

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
  btnSup.classList.add("bg-danger");

  btnModif.addEventListener("click", () => {
    modifier(tache);
  });

  btnSup.addEventListener("click", () => {
    if (confirm("Voulez-vous supprimer cette tâche ?")) supprimer(tache.id);
  });

  carte.append(h3, span, p, pDate, btnModif, btnSup);

  dragAndDrop(carte, tache);

  return carte;
}

function echangerTache(source, cible) {
  let indexSource = taches.findIndex((t) => t.id == source);
  let indexCible = taches.findIndex((t) => t.id == cible);

  if (indexSource == -1 || indexCible == -1 || indexCible == indexSource)
    return;

  const tachedeplace = taches.splice(indexSource, 1)[0];
  taches.splice(indexCible, 0, tachedeplace);
}

function dragAndDrop(carte, tache) {
  carte.draggable = true;

  // Début du déplacement
  carte.addEventListener("dragstart", (e) => {
    idTacheEnDep = tache.id;

    carte.classList.add("carteMove");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(tache.id));
  });

  // Survold'une carte pendant le déplacement
  carte.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (idTacheEnDep !== tache.id) {
      carte.classList.add("survole");
    }
  });

  // Dépôt sur cette carte - échange - sauvegarde - réaffiche
  carte.addEventListener("drop", (e) => {
    e.preventDefault();

    carte.classList.remove("survole");
    if (idTacheEnDep !== null) {
      echangerTache(tache.id, idTacheEnDep);
      saveToStorage();
      afficherTache();
    }
  });

  // Fin du déplacement (déposé ou annulé)
  carte.addEventListener("dragend", (e) => {
    carte.classList.remove("carteMove");
    idTacheEnDep = null;
  });
}

// FILTERS
btnFiltres.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    btnFiltres.forEach((btn) => {
      btn.classList.remove("actif");
    });

    btn.classList.add("actif");
    filtreSatut = btn.dataset.statut;
    afficherTache();
  });
});

function tachesAffichees() {
  return taches.filter((tache) => {
    // filtre par statut
    const statut = filtreSatut === "toutes" || tache.statut === filtreSatut;
    return statut;
  });
}

function afficherTache() {
  liste.innerHTML = "";

  const tachesAaffichees = tachesAffichees();

  tachesAaffichees.forEach((tache) => {
    liste.append(createCarte(tache));
  });

  stats();
}

function createElem(elem, content = "") {
  const el = document.createElement(elem);
  el.textContent = content;

  return el;
}

function stats() {
  const nombreByStatus = [];

  for (let statut in STATUTS) {
    const nbr = taches.filter((tache) => tache.statut === statut).length;
    nombreByStatus.push(statut + ": " + nbr);
  }

  byId("stats").textContent =
    `Total: ${taches.length} | ${nombreByStatus.join(" | ")}`;
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
