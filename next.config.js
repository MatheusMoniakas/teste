/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removido output: 'export' para funcionar melhor no Vercel
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
