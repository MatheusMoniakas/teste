import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TEST ROUTE ===')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'CONFIGURADA' : 'NÃO CONFIGURADA')
    
    return NextResponse.json({
      message: 'Teste funcionando',
      environment: process.env.NODE_ENV,
      databaseConfigured: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Test route error:', error)
    return NextResponse.json(
      { error: 'Erro no teste', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    console.log('=== TEST REGISTER ===')
    console.log('Data received:', { email, name, hasPassword: !!password })
    
    // Simular criação de usuário sem banco
    const mockUser = {
      id: 1,
      email: email,
      name: name,
      created_at: new Date().toISOString()
    }
    
    return NextResponse.json({
      message: 'Usuário criado com sucesso (MOCK)',
      user: mockUser
    })
  } catch (error) {
    console.error('Test register error:', error)
    return NextResponse.json(
      { error: 'Erro no teste de registro', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
