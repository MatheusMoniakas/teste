import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TESTE DE VARIÁVEIS DE AMBIENTE ===')
    
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Configurada' : 'Não configurada',
      JWT_SECRET: process.env.JWT_SECRET ? 'Configurada' : 'Não configurada',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Configurada' : 'Não configurada',
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada'
    }
    
    console.log('Variáveis de ambiente:', envVars)
    
    return NextResponse.json({
      message: 'Teste de variáveis de ambiente',
      environment: envVars,
      timestamp: new Date().toISOString()
    }, { status: 200 })
  } catch (error) {
    console.error('Erro no teste de variáveis:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
