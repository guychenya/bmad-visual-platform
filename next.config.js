/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are now enabled by default in Next.js 14
  images: {
    domains: ['your-supabase-project.supabase.co'],
    // Don't use unoptimized for Netlify - it supports Next.js images
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Netlify supports Next.js fully, no need for static export
  // output: 'export', // Removed this line
  // Netlify handles routing automatically
}

module.exports = nextConfig