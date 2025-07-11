#!/bin/bash

# BMad Visual Platform - Deployment Script
# This script helps with deployment to Netlify

echo "🚀 Starting BMad Visual Platform deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Type check
echo "🔍 Running type check..."
npm run type-check

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "🎉 Ready for deployment to Netlify!"

# Optional: Run tests if available
if grep -q "test" package.json; then
    echo "🧪 Running tests..."
    npm test
fi

echo "🌐 Your BMad Visual Platform is ready!"
echo "📝 Don't forget to set up your environment variables in Netlify:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - OPENAI_API_KEY (optional)"
echo "   - CLAUDE_API_KEY (optional)"