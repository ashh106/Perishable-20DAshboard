#!/bin/bash

# Walmart Smart Perishables Dashboard - Quick Start Script
echo "🚀 Starting Walmart Smart Perishables Dashboard (Full Stack)"
echo "============================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating environment configuration..."
    cp .env.example .env
    echo "✅ Created .env file - you can edit it to add your OpenAI API key"
else
    echo "✅ Environment configuration found"
fi

# Build the application
echo "🔨 Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Start the server
echo "🚀 Starting production server..."
echo ""
echo "💾 Database: SQLite (walmart_perishables.db)"
echo "🔐 Default Login: admin@walmart.com / admin123"
echo "🤖 GenAI: Set OPENAI_API_KEY in .env for real AI features"
echo ""
echo "============================================================"

npm start
