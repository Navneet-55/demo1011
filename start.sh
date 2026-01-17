#!/bin/bash

# GyaanForge - Development Server Startup Script
# This script handles all setup and starts the dev server

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    GyaanForge v1.0.0                       ║"
echo "║          AI-Powered Learning Platform                      ║"
echo "║   Understand code with adaptive explanations               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node.js $NODE_VERSION found"

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are you in the project directory?"
    exit 1
fi

echo "✓ Project files found"
echo ""

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
    echo "✓ Dependencies installed"
fi

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  .env.local not found"
    echo ""
    echo "Setting up environment variables..."
    cp .env.example .env.local
    echo ""
    echo "📝 Please edit .env.local and add your OpenAI API key:"
    echo "   OPENAI_API_KEY=sk-your-key-here"
    echo ""
    echo "Get an API key from: https://platform.openai.com/api-keys"
    echo ""
    read -p "Press Enter after adding your API key to .env.local..."
fi

echo ""
echo "🚀 Starting development server..."
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✨ Ready to forge understanding!                          ║"
echo "║                                                            ║"
echo "║  📱 Open: http://localhost:3000                            ║"
echo "║  🌙 Dark Mode: Available                                   ║"
echo "║  ⚡ Hot Reload: Enabled                                    ║"
echo "║  📝 Keyboard: Cmd/Ctrl + Enter to submit                   ║"
echo "║                                                            ║"
echo "║  Press Ctrl+C to stop the server                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Start the dev server
npm run dev
