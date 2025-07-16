#!/bin/bash

# Quality Compliance Dashboard Deployment Script

echo "🚀 Deploying Quality Compliance Dashboard..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "⚠️  Warning: Supabase environment variables not set. Please configure:"
    echo "   NEXT_PUBLIC_SUPABASE_URL"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type checking
echo "🔍 Running type checks..."
npm run type-check

# Build the application
echo "🏗️  Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Run tests (if available)
if [ -f "jest.config.js" ]; then
    echo "🧪 Running tests..."
    npm test
fi

# Deploy to Vercel (if vercel is installed)
if command -v vercel &> /dev/null; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
else
    echo "📝 Vercel CLI not found. To deploy:"
    echo "   1. Install Vercel CLI: npm i -g vercel"
    echo "   2. Run: vercel --prod"
fi

# Deploy to Netlify (if netlify is installed)
if command -v netlify &> /dev/null; then
    echo "🚀 Deploying to Netlify..."
    netlify deploy --prod --dir=.next
else
    echo "📝 Netlify CLI not found. To deploy:"
    echo "   1. Install Netlify CLI: npm i -g netlify-cli"
    echo "   2. Run: netlify deploy --prod --dir=.next"
fi

echo "✅ Deployment process complete!"
echo ""
echo "🌟 Quality Compliance Dashboard Features:"
echo "   • Real-time compliance metrics"
echo "   • CAPA management system"
echo "   • Training tracking"
echo "   • Audit management"
echo "   • Document management"
echo "   • Interactive data visualizations"
echo ""
echo "🔗 Application URLs:"
echo "   • Dashboard: /compliance"
echo "   • Authentication: /auth/login"
echo "   • Main Site: /"
echo ""
echo "📚 Next Steps:"
echo "   1. Configure your Supabase project"
echo "   2. Apply database migrations"
echo "   3. Run the sample data script"
echo "   4. Test the application"
echo "   5. Configure monitoring and backups"