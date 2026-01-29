@echo off
REM Windows Quick Start Script

echo ==================================================
echo Cloud Threat Detection System - Windows
echo ==================================================
echo.

echo [*] Installing dependencies...
pip install -r requirements.txt

echo.
echo [*] Starting server...
python app.py

pause
