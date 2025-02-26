// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAQR6SPQmcR_VB4iMyb5kdr-CFCgnsBp6Q",
  authDomain: "fire-detection-aafdc.firebaseapp.com",
  databaseURL: "https://fire-detection-aafdc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fire-detection-aafdc",
  storageBucket: "fire-detection-aafdc.firebasestorage.app",
  messagingSenderId: "866669467002",
  appId: "1:866669467002:web:2139a073556a7527afb2c3"
};

// Initialisation Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const sensorsRef = database.ref('sensor');

// Fonction pour mettre à jour les valeurs avec une animation
function updateValue(id, newValue, isFlame = false) {
  const element = document.getElementById(id);

  // Vérifie si l'élément existe
  if (!element) {
    console.error(`Élément avec l'ID "${id}" non trouvé.`);
    return;
  }
  

  // Si c'est le capteur de flamme, traite la valeur comme un état binaire
  if (isFlame) {
    const flameStatus = newValue === 1 ? 'Fire Detected' : 'No Fire'; // Updated text
    if (element.textContent !== flameStatus) {
      // Réinitialise l'animation pour la relancer
      element.style.animation = 'none';
      setTimeout(() => {
        element.style.animation = 'fadeIn 0.3s ease-in-out';
        element.textContent = flameStatus;
      }, 50);
    }
    return;
  }

  // Pour les autres capteurs, traite la valeur comme un nombre
  const oldValue = parseFloat(element.textContent) || 0;
  if (oldValue !== newValue) {
    // Réinitialise l'animation pour la relancer
    element.style.animation = 'none';
    setTimeout(() => {
      element.style.animation = 'fadeIn 0.3s ease-in-out';
      element.textContent = newValue;
    }, 50);
  }
}

// Fonction pour gérer les alertes
function handleAlerts(coLevel, co2Level, flameDetected) {
  const alertTemp = document.getElementById('alert-temp');
  const alertCO = document.getElementById('alert-co');
  const alertCO2 = document.getElementById('alert-co2');
  const alertFlame = document.getElementById('alert-flame');
  const alertGeneral = document.getElementById('alert-general');

  // Alerte pour la température
  if (coLevel > 50) {
    alertCO.classList.add('active');
  } else {
    alertCO.classList.remove('active');
  }

  // Alerte pour le CO2
  if (co2Level > 1000) {
    alertCO2.classList.add('active');
  } else {
    alertCO2.classList.remove('active');
  }

  // Alerte pour la flamme
  if (flameDetected === 1) {
    alertFlame.classList.add('active');
  } else {
    alertFlame.classList.remove('active');
  }

  // Alerte générale (si l'une des conditions est remplie)
  if (coLevel > 50 || co2Level > 1000 || flameDetected === 1) {
    alertGeneral.classList.add('active');
  } else {
    alertGeneral.classList.remove('active');
  }
}

// Écoute les données de Firebase
sensorsRef.on('value', (snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    console.log(data);

    // Met à jour les valeurs des capteurs
    updateValue('temperature', data.temperature);
    updateValue('humidity', data.humidity);
    updateValue('co2', data.co2);
    updateValue('co', data.CO);
    updateValue('flame', data.flame, true); // Traite le capteur de flamme différemment

    // Vérifie les alertes
    handleAlerts(data.CO, data.co2, data.flame);
  } else {
    console.error("Aucune donnée trouvée dans Firebase.");
  }
}, (error) => {
  console.error('Erreur lors de la récupération des données Firebase :', error);
});
