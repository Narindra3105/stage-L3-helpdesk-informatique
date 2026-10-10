const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Helpdesk fonctionne !');
});

app.use('/api/auth', require('./routes/auth.routes'));

module.exports = app;