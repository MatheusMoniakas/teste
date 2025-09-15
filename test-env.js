// Teste simples para verificar variáveis de ambiente
console.log('=== TESTE DE VARIÁVEIS DE AMBIENTE ===')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'CONFIGURADA' : 'NÃO CONFIGURADA')
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'CONFIGURADA' : 'NÃO CONFIGURADA')
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? 'CONFIGURADA' : 'NÃO CONFIGURADA')
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'CONFIGURADA' : 'NÃO CONFIGURADA')
console.log('NODE_ENV:', process.env.NODE_ENV)

if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL (mascarada):', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@'))
}
