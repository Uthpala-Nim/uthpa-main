const request = require('supertest');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';
const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL || 'http://localhost:3006';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3007';
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3005';

describe('Lugx Gaming Integration Tests', () => {
  describe('Frontend', () => {
    it('should serve the main page', async () => {
      const response = await request(BASE_URL).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Lugx Gaming');
    });

    it('should serve the shop page', async () => {
      const response = await request(BASE_URL).get('/shop.html');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Our Shop');
    });
  });

  describe('Game Service', () => {
    it('should be healthy', async () => {
      const response = await request(GAME_SERVICE_URL).get('/health');
      expect(response.status).toBe(200);
      expect(response.text).toBe('ok');
    });

    it('should list games', async () => {
      const response = await request(GAME_SERVICE_URL).get('/games');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should create a new game', async () => {
      const newGame = {
        name: 'Test Game',
        category: 'Action',
        price: 49.99,
        released_at: new Date().toISOString().split('T')[0]
      };

      const response = await request(GAME_SERVICE_URL)
        .post('/games')
        .send(newGame);
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newGame.name);
    });
  });

  describe('Order Service', () => {
    it('should be healthy', async () => {
      const response = await request(ORDER_SERVICE_URL).get('/health');
      expect(response.status).toBe(200);
      expect(response.text).toBe('ok');
    });

    it('should create an order', async () => {
      const order = {
        items: [
          { name: 'Test Game', price: 49.99 }
        ]
      };

      const response = await request(ORDER_SERVICE_URL)
        .post('/orders')
        .send(order);
      
      expect(response.status).toBe(201);
      expect(response.body.items).toHaveLength(1);
    });
  });

  describe('Analytics Service', () => {
    it('should be healthy', async () => {
      const response = await request(ANALYTICS_SERVICE_URL).get('/health');
      expect(response.status).toBe(200);
      expect(response.text).toBe('ok');
    });

    it('should track events', async () => {
      const event = {
        session_id: 'test-session',
        event: 'test_event',
        path: '/test',
        value: 'test_value'
      };

      const response = await request(ANALYTICS_SERVICE_URL)
        .post('/track')
        .send(event);
      
      expect(response.status).toBe(200);
    });

    it('should expose metrics', async () => {
      const response = await request(ANALYTICS_SERVICE_URL).get('/metrics');
      expect(response.status).toBe(200);
      expect(response.text).toContain('analytics_events_total');
    });
  });

  describe('End-to-End Flow', () => {
    it('should complete a full purchase flow', async () => {
      // 1. Create a game
      const game = {
        name: 'E2E Test Game',
        category: 'Action',
        price: 59.99,
        released_at: new Date().toISOString().split('T')[0]
      };

      const gameResponse = await request(GAME_SERVICE_URL)
        .post('/games')
        .send(game);
      
      expect(gameResponse.status).toBe(201);
      const createdGame = gameResponse.body;

      // 2. Create an order for the game
      const order = {
        items: [
          { 
            name: createdGame.name, 
            price: createdGame.price 
          }
        ]
      };

      const orderResponse = await request(ORDER_SERVICE_URL)
        .post('/orders')
        .send(order);
      
      expect(orderResponse.status).toBe(201);

      // 3. Track the purchase event
      const analyticsEvent = {
        session_id: 'e2e-test-session',
        event: 'purchase',
        path: '/shop.html',
        value: JSON.stringify(order)
      };

      const analyticsResponse = await request(ANALYTICS_SERVICE_URL)
        .post('/track')
        .send(analyticsEvent);
      
      expect(analyticsResponse.status).toBe(200);
    });
  });
});
