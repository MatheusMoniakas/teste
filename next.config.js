/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para exportação estática (Netlify)
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
