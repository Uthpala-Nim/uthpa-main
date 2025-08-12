const express = require('express');
const { sequelize, Game } = require('./models');
const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/health', (req, res) => res.send('ok'));

app.post('/games', async (req, res) => {
  try {
    const { name, category, released_at, price } = req.body || {};
    if (!name) return res.status(400).send({error:'name required'});
    const game = await Game.create({ name, category, released_at, price });
    res.status(201).send(game);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/games', async (req, res) => {
  try {
    const games = await Game.findAll();
    res.send(games);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Function to retry database connection
const connectWithRetry = () => {
  sequelize.sync()
    .then(() => {
      console.log('Database synced');
      app.listen(3001, () => console.log('game-service on 3001'));
    })
    .catch(err => {
      console.error('Failed to sync database:', err);
      console.log('Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

// Start the connection process
connectWithRetry();
