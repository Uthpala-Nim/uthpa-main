# 🎮 Lugx Gaming Platform

A full-stack gaming e-commerce platform with microservices architecture, featuring a responsive frontend and multiple backend services for games, orders, and analytics.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start Guide](#quick-start-guide)
- [Services Overview](#services-overview)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Development Setup](#development-setup)
- [Testing the Application](#testing-the-application)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

## 🎯 Overview

This is a modern gaming platform that allows users to:
- Browse and purchase games
- Track user analytics and behavior
- Manage orders and inventory
- View game details and categories

The platform is built using a microservices architecture with separate services for different functionalities.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │ Analytics       │    │ Game Service    │    │ Order Service   │
│   (Port 8080)   │◄──►│ Service         │    │ (Port 3001)     │    │ (Port 3002)     │
│                 │    │ (Port 3000)     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

- **Frontend**: Static HTML/CSS/JS served via Python HTTP server
- **Analytics Service**: Tracks user events and behavior
- **Game Service**: Manages game catalog and information
- **Order Service**: Handles order creation and management

## 📋 Prerequisites

Before you start, make sure you have the following installed:

### Required Software:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **Python** (version 3.7 or higher) - [Download here](https://python.org/)
- **Git** (optional, for version control) - [Download here](https://git-scm.com/)

### Check if installed:
```powershell
# Check Node.js
node --version

# Check Python
python --version

# Check npm (comes with Node.js)
npm --version
```

## 🚀 Quick Start Guide

### Step 1: Download the Project
1. Extract the project files to a folder (e.g., `C:\Users\YourName\Downloads\CW\CW`)
2. Open PowerShell or Command Prompt as Administrator

### Step 2: Install Dependencies
Navigate to the project directory and install dependencies for each service:

```powershell
# Navigate to project directory
cd "C:\Users\YourName\Downloads\CW\CW"

# Install Analytics Service dependencies
cd "services\analytics-service"
npm install
cd ..\..

# Install Game Service dependencies
cd "services\game-service"
npm install
cd ..\..

# Install Order Service dependencies
cd "services\order-service"
npm install
cd ..\..
```

### Step 3: Start the Backend Services

Open **4 separate PowerShell windows** and run each service:

**Window 1 - Analytics Service:**
```powershell
cd "C:\Users\YourName\Downloads\CW\CW\services\analytics-service"
npm start
```

**Window 2 - Game Service:**
```powershell
cd "C:\Users\YourName\Downloads\CW\CW\services\game-service"
npm start
```

**Window 3 - Order Service:**
```powershell
cd "C:\Users\YourName\Downloads\CW\CW\services\order-service"
npm start
```

**Window 4 - Frontend:**
```powershell
cd "C:\Users\YourName\Downloads\CW\CW\frontend"
python -m http.server 8080
```

### Step 4: Access the Application

Once all services are running, open your web browser and visit:

- **Main Website**: http://localhost:8080
- **API Test Dashboard**: http://localhost:8080/api-test.html

## 🔧 Services Overview

### Analytics Service (Port 3000)
- **Purpose**: Track user events and behavior analytics
- **Endpoints**: 
  - `GET /health` - Service health check
  - `POST /track` - Track user events
  - `GET /events` - Retrieve recent events

### Game Service (Port 3001)
- **Purpose**: Manage game catalog and information
- **Endpoints**:
  - `GET /health` - Service health check
  - `GET /games` - Get all games
  - `POST /games` - Create a new game

### Order Service (Port 3002)
- **Purpose**: Handle order creation and management
- **Endpoints**:
  - `GET /health` - Service health check
  - `GET /orders` - Get all orders
  - `POST /orders` - Create a new order

### Frontend (Port 8080)
- **Purpose**: User interface for the gaming platform
- **Features**: Game browsing, product details, contact forms, API testing dashboard

## 📖 API Documentation

### Creating a Game
```javascript
POST http://localhost:3001/games
Content-Type: application/json

{
  "name": "Cyberpunk Adventure",
  "category": "RPG",
  "released_at": "2024-01-15",
  "price": 49.99
}
```

### Creating an Order
```javascript
POST http://localhost:3002/orders
Content-Type: application/json

{
  "items": [
    {"name": "Game 1", "price": 49.99},
    {"name": "Game 2", "price": 29.99}
  ]
}
```

### Tracking an Event
```javascript
POST http://localhost:3000/track
Content-Type: application/json

{
  "session_id": "user-session-123",
  "event": "game_viewed",
  "path": "/product-details.html",
  "value": "cyberpunk-adventure"
}
```

## 🎨 Frontend Features

### Pages Available:
- **index.html** - Main homepage with featured games
- **shop.html** - Game catalog and shopping page
- **product-details.html** - Individual game details
- **contact.html** - Contact form
- **api-test.html** - API testing dashboard

### Key Features:
- Responsive design that works on desktop and mobile
- Bootstrap-based UI components
- Interactive game browsing
- Real-time API communication
- Event tracking integration

## 💻 Development Setup

### File Structure:
```
CW/
├── README.md                 # This documentation
├── docker-compose.yml        # Docker configuration (optional)
├── frontend/                 # Frontend application
│   ├── index.html           # Main homepage
│   ├── api-test.html        # API testing dashboard
│   ├── assets/              # CSS, JS, and images
│   └── vendor/              # Third-party libraries
├── services/                # Backend microservices
│   ├── analytics-service/   # User analytics tracking
│   ├── game-service/        # Game catalog management
│   └── order-service/       # Order processing
└── k8s/                     # Kubernetes configurations
```

### Configuration Files:
- `frontend/assets/js/config.js` - Service URL configurations
- `frontend/assets/js/api-service.js` - API communication functions
- Each service has its own `package.json` with dependencies

## 🧪 Testing the Application

### 1. Service Health Checks
Visit the API test dashboard at http://localhost:8080/api-test.html to check if all services are running properly.

### 2. Manual API Testing
Use PowerShell to test APIs directly:

```powershell
# Test game creation
Invoke-WebRequest -Uri "http://localhost:3001/games" -Method POST -Body '{"name": "Test Game", "category": "Action", "price": 39.99}' -ContentType "application/json"

# Test getting games
Invoke-WebRequest -Uri "http://localhost:3001/games" -Method GET

# Test order creation
Invoke-WebRequest -Uri "http://localhost:3002/orders" -Method POST -Body '{"items": [{"name": "Test Game", "price": 39.99}]}' -ContentType "application/json"
```

### 3. Frontend Testing
- Browse the main website to test UI functionality
- Use the browser's Developer Tools (F12) to check console logs
- Test form submissions and navigation

## 🛠️ Troubleshooting

### Common Issues:

#### "Port already in use" Error:
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Check if another service is using the port, or restart your computer to free up ports.

#### "Cannot GET /" Error:
**Solution**: Make sure the frontend server is running on port 8080 and you're accessing the correct URL.

#### Services Not Connecting:
1. Check that all 4 services are running in separate terminals
2. Verify no firewalls are blocking the ports
3. Ensure Node.js and Python are properly installed

#### CORS Errors in Browser:
**Solution**: The services are already configured with CORS headers. If you still see errors, try refreshing the page or restarting the services.

### Debug Commands:
```powershell
# Check which ports are in use
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002
netstat -ano | findstr :8080

# Test service connectivity
Invoke-WebRequest -Uri "http://localhost:3000/health"
Invoke-WebRequest -Uri "http://localhost:3001/health"
Invoke-WebRequest -Uri "http://localhost:3002/health"
```

## 📁 Project Structure

```
CW/
├── 📄 README.md
├── 📄 docker-compose.yml
├── 📂 frontend/
│   ├── 📄 index.html
│   ├── 📄 shop.html
│   ├── 📄 product-details.html
│   ├── 📄 contact.html
│   ├── 📄 api-test.html
│   ├── 📄 Dockerfile
│   ├── 📄 nginx.conf
│   ├── 📂 assets/
│   │   ├── 📂 css/
│   │   ├── 📂 js/
│   │   │   ├── 📄 config.js
│   │   │   ├── 📄 api-service.js
│   │   │   └── 📄 custom.js
│   │   ├── 📂 images/
│   │   └── 📂 webfonts/
│   └── 📂 vendor/
│       ├── 📂 bootstrap/
│       └── 📂 jquery/
├── 📂 services/
│   ├── 📂 analytics-service/
│   │   ├── 📄 package.json
│   │   ├── 📄 index.js
│   │   └── 📄 Dockerfile
│   ├── 📂 game-service/
│   │   ├── 📄 package.json
│   │   ├── 📄 index.js
│   │   └── 📄 Dockerfile
│   └── 📂 order-service/
│       ├── 📄 package.json
│       ├── 📄 server.js
│       └── 📄 Dockerfile
└── 📂 k8s/
    ├── 📄 analytics-service.yaml
    ├── 📄 game-service.yaml
    ├── 📄 order-service.yaml
    ├── 📄 frontend-deployment.yaml
    ├── 📄 frontend-service.yaml
    └── 📄 ingress.yaml
```

## 🎯 Next Steps

After getting the basic application running, you can:

1. **Add more games** using the API test dashboard
2. **Customize the frontend** by editing HTML/CSS files
3. **Add new features** to the backend services
4. **Deploy using Docker** with the provided docker-compose.yml
5. **Deploy to Kubernetes** using the k8s configuration files

## 🔭 Observability

### System Monitoring
Deploy Prometheus and Grafana to monitor your services:

```bash
kubectl apply -f k8s/monitoring.yaml
```

- Prometheus runs on port 9090
- Grafana runs on port 3000 (login `admin`/`admin`)

### Analytics Visualization with AWS QuickSight

The platform integrates with AWS QuickSight for real-time analytics visualization. The following metrics are tracked:

1. User Engagement Metrics:
   - Page Views and Unique Visitors
   - Session Duration
   - Click Events
   - Scroll Depth Analysis

2. Game Analytics:
   - Most Viewed Games
   - Popular Categories
   - Time Spent on Product Pages

3. User Journey Analysis:
   - Navigation Patterns
   - Conversion Funnel
   - Exit Pages

#### QuickSight Setup:

1. Set required environment variables:
```bash
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=your_account_id
export QUICKSIGHT_USER=your_quicksight_user_arn
```

2. The analytics service will automatically:
   - Create a ClickHouse data source in QuickSight
   - Set up datasets for analytics events
   - Create an interactive dashboard

3. Access your dashboard:
   - Log into AWS QuickSight console
   - Navigate to 'Gaming Platform Analytics' dashboard
   - Data refreshes automatically every 15 minutes

#### Available Visualizations:

1. Real-Time Overview:
   - Current Active Users
   - Today's Page Views
   - Average Session Duration

2. Trend Analysis:
   - Hourly/Daily Event Trends
   - User Engagement Patterns
   - Popular Content Heat Map

3. User Behavior:
   - Click Pattern Analysis
   - Scroll Depth Distribution
   - Session Duration Breakdown

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the console logs in your browser (F12)
3. Check the terminal outputs for error messages
4. Ensure all prerequisites are properly installed

---

**Happy Gaming! 🎮**

*This project demonstrates a modern microservices architecture suitable for learning full-stack development concepts.*
