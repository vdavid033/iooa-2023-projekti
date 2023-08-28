const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const korisniciRoutes = require('./routes/korisnici');
const projektiRoutes = require('./routes/projekti');
const sastanciRoutes = require('./routes/sastanci');

// Middleware za omogućavanje CORS-a za sve zahtjeve
app.use(cors());

// Middleware za parsiranje tijela zahtjeva u JSON formatu
app.use(bodyParser.json());

// Uključivanje ruta definiranih u /routes direktoriju
app.use('/api/korisnici', korisniciRoutes);
app.use('/api/projekti', projektiRoutes);
app.use('/api/sastanci', sastanciRoutes);

// Pokretanje servera
app.listen(port, () => {
  console.log(`Poslužitelj pokrenut na portu ${port}`);
});
