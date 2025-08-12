const express = require('express');
const { createClient } = require('@clickhouse/client');
const { createClickHouseDataSource, createAnalyticsDashboard } = require('./quicksight-service');
const promClient = require('prom-client');

// Create a Registry to register metrics
const register = new promClient.Registry();

// Add default metrics (process, nodejs, etc)
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const eventsCounter = new promClient.Counter({
  name: 'analytics_events_total',
  help: 'Total number of analytics events received',
  labelNames: ['event_type']
});

register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(eventsCounter);

const app = express();
app.use(express.json());

// Add request duration middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration / 1000); // Convert to seconds
  });
  next();
});

// Initialize QuickSight if environment variables are set
if (process.env.AWS_ACCOUNT_ID && process.env.QUICKSIGHT_USER) {
  Promise.all([
    createClickHouseDataSource(),
    createAnalyticsDashboard()
  ]).catch(console.error);
}

const clickhouse = createClient({
  url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
});

const TABLE = 'events';

async function init() {
  await clickhouse.command({
    query: `CREATE TABLE IF NOT EXISTS ${TABLE} (
      ts DateTime,
      session_id String,
      event String,
      path String,
      value String
    ) ENGINE = MergeTree ORDER BY ts`,
  });
}
init().catch(console.error);

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

// Add metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.post('/track', async (req, res) => {
  try {
    const { session_id, event, path, value } = req.body || {};
    
    if (!session_id || !event) {
      return res.status(400).json({ error: 'Missing required fields: session_id and event' });
    }
    
    // Increment event counter
    eventsCounter.labels(event).inc();

    const row = {
      ts: new Date().toISOString().replace('T', ' ').slice(0, 19),
      session_id,
      event,
      path: path || '',
      value: value || '',
    };

    await clickhouse.insert({
      table: TABLE,
      values: [row],
      format: 'JSONEachRow',
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
  try {
    await clickhouse.insert({
      table: TABLE,
      values: [row],
      format: 'JSONEachRow',
    });
    console.log('EVENT', row);
    res.status(204).end();
  } catch (err) {
    console.error('INSERT ERROR', err);
    res.status(500).send('error');
  }
});

app.get('/events', async (req, res) => {
  try {
    const result = await clickhouse.query({
      query: `SELECT * FROM ${TABLE} ORDER BY ts DESC LIMIT 25`,
      format: 'JSONEachRow',
    });
    const events = await result.json();
    res.send(events);
  } catch (err) {
    console.error('QUERY ERROR', err);
    res.status(500).send([]);
  }
});

app.listen(3000, () => console.log('analytics-service on 3000'));
