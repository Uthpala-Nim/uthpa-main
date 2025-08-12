const express = require('express');
const { sequelize, Order } = require('./models');
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

app.post('/orders', async (req, res) => {
  try {
    const { items = [] } = req.body || {};
    const total = items.reduce((s, it) => s + (it.price || 0), 0);
    const order = await Order.create({ items, total });
    res.status(201).send(order);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.send(orders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Function to retry database connection
const connectWithRetry = () => {
  sequelize.sync()
    .then(() => {
      console.log('Database synced');
      app.listen(3002, () => console.log('order-service on 3002'));
    })
    .catch(err => {
      console.error('Failed to sync database:', err);
      console.log('Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

// Start the connection process
connectWithRetry();
