@echo off
echo ========================================
echo    Lugx Gaming Platform Startup Script
echo ========================================
echo.
echo This script will help you start all services automatically.
echo Make sure you have Node.js and Python installed first!
echo.
pause

echo Installing dependencies for all services...
echo.

echo [1/3] Installing Analytics Service dependencies...
cd "services\analytics-service"
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install analytics service dependencies
    pause
    exit /b 1
)
cd ..\..

echo [2/3] Installing Game Service dependencies...
cd "services\game-service"
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install game service dependencies
    pause
    exit /b 1
)
cd ..\..

echo [3/3] Installing Order Service dependencies...
cd "services\order-service"
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install order service dependencies
    pause
    exit /b 1
)
cd ..\..

echo.
echo All dependencies installed successfully!
echo.
echo Starting services... This will open 4 new windows.
echo Please keep all windows open while using the application.
echo.
pause

echo Starting Analytics Service...
start "Analytics Service (Port 3000)" cmd /k "cd /d %cd%\services\analytics-service && npm start"

echo Starting Game Service...
start "Game Service (Port 3001)" cmd /k "cd /d %cd%\services\game-service && npm start"

echo Starting Order Service...
start "Order Service (Port 3002)" cmd /k "cd /d %cd%\services\order-service && npm start"

echo Starting Frontend Server...
start "Frontend Server (Port 8080)" cmd /k "cd /d %cd%\frontend && python -m http.server 8080"

echo.
echo ========================================
echo    All services are starting up!
echo ========================================
echo.
echo Wait a few seconds for all services to start, then open your browser and visit:
echo.
echo   Main Website: http://localhost:8080
echo   API Dashboard: http://localhost:8080/api-test.html
echo.
echo To stop all services, simply close all the opened windows.
echo.
echo Press any key to open the main website in your default browser...
pause > nul

start http://localhost:8080

echo.
echo Enjoy the Lugx Gaming Platform!
echo.
pause
