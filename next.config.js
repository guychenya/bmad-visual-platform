/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are now enabled by default in Next.js 14
  images: {
    domains: ['your-supabase-project.supabase.co'],
    // Don't use unoptimized for Netlify - it supports Next.js images
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Netlify supports Next.js fully, no need for static export
  // output: 'export', // Removed this line
  // Netlify handles routing automatically
  
  // Environment variables for web deployment
  env: {
    OLLAMA_HOST: process.env.OLLAMA_HOST || 'http://localhost:11434',
  },
  
  // Exclude local-llm-chat directory from webpack compilation
  webpack: (config, { isServer }) => {
    // Exclude local-llm-chat directory from compilation
    config.module.rules.push({
      test: /local-llm-chat/,
      loader: 'ignore-loader'
    });
    
    return config;
  },
}

module.exports = nextConfig