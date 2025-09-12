/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração otimizada para Vercel
  images: {
    unoptimized: true
  },
  // Garantir que o Vercel use o modo correto
  trailingSlash: false,
  // Desabilitar export estático
  output: undefined
}

module.exports = nextConfig
