/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração padrão para Vercel
  images: {
    unoptimized: true
  },
  // Forçar modo de desenvolvimento para Vercel
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
