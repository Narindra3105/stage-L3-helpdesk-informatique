const express = require('express');
const cors = require('cors');
const {notFound,errorHandler}= require('./middlewares/error.middleware'); 

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Helpdesk fonctionne !');
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tickets',require('./routes/ticket.routes'));
app.use('/api/equipes',require('./routes/equipe.routes'));
app.use('/api/statuts',require('./routes/statut.routes'));
app.use('/api/priorites',require('./routes/priorite.routes'));
app.use('/api/categories',require('./routes/categorie.routes'));
app.use('/api/sla',require('./routes/sla.routes'));
app.use('/api/utilisateurs',require('./routes/utilisateur.routes'));
app.use('/api/commentaires', require('./routes/commentaire.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;