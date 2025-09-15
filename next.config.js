/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para Netlify com serverless functions
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configuração para APIs no Netlify
  experimental: {
    serverComponentsExternalPackages: ['pg']
  }
}

module.exports = nextConfig
