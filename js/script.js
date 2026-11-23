const boutonAjouter = document.getElementById("ajouter");
const formulaireAjouter = document.getElementById("form");

let titre=document.getElementById("titre");
let description=document.getElementById("description");
let statut=document.getElementById("statut");

boutonAjouter.addEventListener ('click', (e) => {
    formulaireAjouter.classList.toggle('cache');
});

formulaireAjouter.addEventListener("submit", (e)=>{
    e.preventDefault()
}
);
