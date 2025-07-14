#!/bin/bash

echo "🚀 Setting up Local LLM Chat Application"
echo "======================================="

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This setup script is designed for macOS only"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "⚠️  Ollama not found. Installing Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
    
    if [ $? -eq 0 ]; then
        echo "✅ Ollama installed successfully"
    else
        echo "❌ Failed to install Ollama"
        exit 1
    fi
else
    echo "✅ Ollama found: $(ollama --version)"
fi

# Create models directory if it doesn't exist
MODELS_PATH="/Users/$(whoami)/.ollama/models"
if [ ! -d "$MODELS_PATH" ]; then
    echo "📁 Creating models directory at $MODELS_PATH"
    mkdir -p "$MODELS_PATH"
fi

echo "✅ Models directory ready: $MODELS_PATH"

# Start Ollama service if not running
if ! pgrep -x "ollama" > /dev/null; then
    echo "🔄 Starting Ollama service..."
    ollama serve &
    sleep 5
fi

# Download recommended models
echo "📦 Downloading recommended models..."

models=("llama3.2:3b" "llama3.2:1b")

for model in "${models[@]}"; do
    echo "⬇️  Downloading $model..."
    ollama pull "$model"
    
    if [ $? -eq 0 ]; then
        echo "✅ $model downloaded successfully"
    else
        echo "⚠️  Failed to download $model (continuing...)"
    fi
done

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Application built successfully"
else
    echo "❌ Failed to build application"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Available commands:"
echo "  npm start          - Start the application"
echo "  npm run dev        - Start in development mode"
echo "  npm run dist       - Build distributable package"
echo ""
echo "📍 Your models are stored at: $MODELS_PATH"
echo ""
echo "To start the application now, run:"
echo "  npm start"
echo ""