const url = "https://api.open-meteo.com/v1/forecast?latitude=45.7640&longitude=4.8357&hourly=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto";


// Descriptions météo
const weatherDescriptions = {
    0: "Ciel clair",
    1: "Principalement clair",
    2: "Partiellement nuageux",
    3: "Couvert",
    45: "Brouillard",
    48: "Brouillard givrant",
    51: "Bruine légère",
    53: "Bruine modérée",
    55: "Bruine dense",
    61: "Pluie légère",
    63: "Pluie modérée",
    65: "Pluie dense",
    80: "Averses légères",
    81: "Averses modérées",
    82: "Averses violentes"
};

const weatherImages = {
    0: "assets/img/code/clear.png",
    1: "assets/img/code/clear.png",
    2: "assets/img/code/cloudy.png",
    3: "assets/img/code/cloudy.png",
    45: "assets/img/code/foggy.png",
    48: "assets/img/code/foggy.png",
    51: "assets/img/code/foggy.png",
    53: "assets/img/code/foggy.png",
    55: "assets/img/code/foggy.png",
    61: "assets/img/code/rain.png",
    63: "assets/img/code/rain.png",
    65: "assets/img/code/rain.png",
    80: "assets/img/code/showers.png",
    81: "assets/img/code/showers.png",
    82: "assets/img/code/showers.png"
};

const bgImage= {
    0:"assets/img/sun.jpg",
    1:"assets/img/suncloud.jpg",
    2:"assets/img/rain.jpg",
    4:"assets/img/thunder.jpg",
    5:"assets/img/thunder.jpg"
}



// Fonction pour convertir les degrés en points cardinaux
function convertirDirection(degres) {
    const directions = ["Nord", "Nord-Est", "Est", "Sud-Est", "Sud", "Sud-Ouest", "Ouest", "Nord-Ouest"];
    return directions[Math.round(degres / 45) % 8];
}

fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(donnees) {
        console.log(donnees);



// Date et heure actuelles
const dateAujourdhui = new Date();
const jourActuel = dateAujourdhui.getDate();
const moisActuel = dateAujourdhui.getMonth() + 1; // Les mois commencent à 0
const anneeActuelle = dateAujourdhui.getFullYear();
const heureActuelle = dateAujourdhui.getHours();
const minuteActuelle = String(dateAujourdhui.getMinutes()).padStart(2, '0');
const isDay = heureActuelle >= 6 && heureActuelle < 18; // Exemple condition
const imageSrc = isDay ? "assets/img/day.png" : "assets/img/moon.png";
        
document.querySelector('.general').innerHTML = `
${jourActuel}/${moisActuel}/${anneeActuelle}
<span class="time">${heureActuelle}:${minuteActuelle}</span>
<img id="day-image" src="${imageSrc}" alt="Image jour ou nuit">
`;
        
        // Météo actuelle
       // Récupérer la température et le code météo actuel
const temperatureActuelle = donnees.hourly.temperature_2m[0];
const weatherCodeActuel = donnees.hourly.weather_code[0];
const weatherDescriptionActuelle = weatherDescriptions[weatherCodeActuel];
const weatherImageActuelle = weatherImages[weatherCodeActuel]; // Associer une image au code

// Mettre à jour le contenu HTML dans .now
document.querySelector('.now').innerHTML = `
    ${weatherDescriptionActuelle}
    <img src="${weatherImageActuelle}" alt="${weatherDescriptionActuelle}">
    ${temperatureActuelle}°C
`;


 // Récupérer l'image correspondante en fonction du code météo
 const bgImageActuelle = bgImage[weatherCodeActuel] || "assets/img/suncloud.jpg"; // Utiliser une image par défaut si le code est inconnu

// Appliquer l'image comme fond d'écran
document.body.style.backgroundImage = `url(${bgImageActuelle})`;
document.body.style.backgroundSize = "cover"; 
document.body.style.backgroundPosition = "center"; 


// Définir une constante pour l'image de la boussole
const imageArrow = `<img id="wind-compass" src="assets/img/compass-arrow.png" alt="Boussole" style="transform: rotate(0deg);">`;
const imageBoussole=`<img id="compass" src="assets/img/compass.png" alt="Boussole">`;

// Récupérer les données actuelles
const town = donnees.timezone; 
console.log(town);

const vitesseVentActuelle = donnees.hourly.wind_speed_10m[0];
const directionVentActuelleDegres = donnees.hourly.wind_direction_10m[0];


// Insérer la constante image dans le contenu HTML
document.querySelector('.boussole').innerHTML = `
    <span class="town">${town}</span>
    <span class="compass">${imageBoussole}</span>
    <span class="arrow">${imageArrow}</span>
    <span class="vitesse">${vitesseVentActuelle} km/h</span>  
`;

// Mettre à jour la rotation de l'image en fonction de la direction du vent
document.getElementById("wind-compass").style.transform = `rotate(${directionVentActuelleDegres}deg)`;


// Données horaires (température, pluie, vent)
const heures = donnees.hourly.time;
const temperaturesHoraires = donnees.hourly.temperature_2m;
const pluiesHoraires = donnees.hourly.precipitation;

const heureElement = document.querySelector('.heure');
heureElement.innerHTML = ""; // Réinitialiser le contenu
for (let i = 0; i < heures.length; i++) {
    const heure = heures[i].split("T")[1]; // Extraire uniquement l'heure
    const temperature = temperaturesHoraires[i];
    const pluie = pluiesHoraires[i];

    heureElement.innerHTML += `
        <div class="item">
        <span class="item-temperature">${temperature}°C</span>
        <span class="item-pluie">${pluie}mm</span>
        <span class="item-heure">${heure}</span>`
}

// Données journalières
if (donnees.daily) {
    const jours = donnees.daily.time;
    const temperaturesMax = donnees.daily.temperature_2m_max;
    const temperaturesMin = donnees.daily.temperature_2m_min;
    const pluiesJournalieres = donnees.daily.precipitation_sum;
    const weatherCodesJour = donnees.daily.weather_code;
    const semaineElement = document.querySelector('.semaine');
    semaineElement.innerHTML = ""; // Réinitialiser le contenu
    for (let i = 0; i < jours.length; i++) {
        const jour = jours[i];
        const tempMax = temperaturesMax[i];
        const tempMin = temperaturesMin[i];
        const pluieJour = pluiesJournalieres[i];
        const weatherDescriptionJour = weatherDescriptions[weatherCodesJour[i]];

    semaineElement.innerHTML += `
            <div class="daily">
            <span class="daily-jour">${jour}</span>
            <span class="daily-description">${weatherDescriptionJour}</span>
            <img src="${weatherImageActuelle}" alt="${weatherDescriptionActuelle}">
            <span class="daily-max">${tempMax}°C</span>
            <span class="daily-min">${tempMin}°C</span>
            `;
    }
} else {
    console.error("Les données journalières sont absentes.");
    document.querySelector('.semaine').innerHTML = "Données journalières indisponibles.";
}
        

})
.catch(function(erreur) {
    console.error("Erreur :", erreur);
    document.getElementById("resultat").innerText = "Erreur de chargement.";
});


    
