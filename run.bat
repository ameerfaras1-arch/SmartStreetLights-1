@echo off
title Smart Street Light Management System - Karnataka
color 0b
echo =====================================================================
echo    SMART STREET LIGHT MANAGEMENT SYSTEM - KARNATAKA (30 CITIES)
echo    IoT-Based Intelligent Street Lighting & Energy Management
echo =====================================================================
echo.
echo [*] Starting Local Web Server on Port 8080...
echo [*] Opening application in your web browser: http://localhost:8080
echo.
echo =====================================================================
echo   DEMO LOGIN CREDENTIALS:
echo   - Mobile:   123456789
echo   - Password: 786786
echo   - OTP Code: 7860 (or click Auto-Fill in UI)
echo =====================================================================
echo.
echo Press Ctrl+C in this window to stop the server at any time.
echo.

start "" "http://localhost:8080"
python -m http.server 8080
pause
