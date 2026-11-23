const boutonAjouter = document.getElementById("ajouter");
const formulaireAjouter = document.getElementById("form");

boutonAjouter.addEventListener ('click', (e) => {
    formulaireAjouter.classList.toggle('cache');
});