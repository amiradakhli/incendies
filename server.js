const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Données des capteurs
let sensorData = {
  temperature: 0,
  humidity: 0,
  co2: 0,
  co: 0,
  flame: 0,
};

// Endpoint pour recevoir les données des capteurs
app.post('/api/data', (req, res) => {
  try {
    sensorData = req.body;
    console.log("Données reçues:", sensorData);
    res.status(200).send("Données reçues");
  } catch (error) {
    console.error("Erreur lors de la réception des données:", error);
    res.status(500).send("Erreur interne du serveur");
  }
});

// Endpoint pour récupérer les données des capteurs
app.get('/api/data', (req, res) => {
  try {
    res.status(200).json(sensorData);
  } catch (error) {
    console.error("Erreur lors de l'envoi des données:", error);
    res.status(500).send("Erreur interne du serveur");
  }
});

// Route pour servir index.html par défaut
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
