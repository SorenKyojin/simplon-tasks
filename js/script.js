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
    let titre1 = titre.value;
    let description1 = description.value;
    let statut1 = statut.value;
    
    console.log(titre1);
    console.log(description1);
    console.log(statut1);
    


}
);
