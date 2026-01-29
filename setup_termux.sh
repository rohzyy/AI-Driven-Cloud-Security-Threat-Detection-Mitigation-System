#!/bin/bash
# Termux Setup Script for Cloud Threat Detection System

echo "=================================================="
echo "🚀 Cloud Threat Detection System - Termux Setup"
echo "=================================================="

# Update packages
echo "📦 Updating Termux packages..."
pkg update -y
pkg upgrade -y

# Install Python and Git
echo "🐍 Installing Python and Git..."
pkg install python git -y

# Install pip dependencies
echo "📚 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  python app.py"
echo ""
echo "Then open browser to: http://localhost:5000"
echo "=================================================="
