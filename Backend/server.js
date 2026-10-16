require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Connexion MySQL réussie');

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Connexion MySQL impossible :', err.message);
    process.exit(1);
  }
};

start();