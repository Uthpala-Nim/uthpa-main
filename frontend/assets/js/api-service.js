// API handlers for services

// Analytics Service
async function getAnalytics() {
    try {
        const response = await fetch(`${CONFIG.ANALYTICS_SERVICE_URL}/events`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return null;
    }
}

async function trackEvent(eventData) {
    try {
        const response = await fetch(`${CONFIG.ANALYTICS_SERVICE_URL}/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData)
        });
        return response.ok;
    } catch (error) {
        console.error('Error tracking event:', error);
        return false;
    }
}

// Game Service
async function getGames() {
    try {
        const response = await fetch(`${CONFIG.GAME_SERVICE_URL}/games`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching games:', error);
        return null;
    }
}

async function createGame(gameData) {
    try {
        const response = await fetch(`${CONFIG.GAME_SERVICE_URL}/games`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameData)
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating game:', error);
        return null;
    }
}

// Order Service
async function createOrder(orderData) {
    try {
        const response = await fetch(`${CONFIG.ORDER_SERVICE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
}

async function getOrders() {
    try {
        const response = await fetch(`${CONFIG.ORDER_SERVICE_URL}/orders`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return null;
    }
}
