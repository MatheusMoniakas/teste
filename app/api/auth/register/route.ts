import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('=== REGISTER ROUTE START ===')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL)
    
    const { email, password, name } = await request.json()
    console.log('Request data:', { email, name, hasPassword: !!password })

    // Validações básicas
    if (!email || !password || !name) {
      console.log('Validation failed: missing fields')
      return NextResponse.json(
        { error: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      console.log('Validation failed: password too short')
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    console.log('Starting user creation...')
    // Criar usuário
    const user = await createUser(email, password, name)
    console.log('User creation result:', user ? 'SUCCESS' : 'FAILED')

    if (!user) {
      console.log('User creation failed')
      return NextResponse.json(
        { error: 'Erro ao criar usuário. Email já existe ou erro de conexão.' },
        { status: 400 }
      )
    }

    console.log('User created successfully:', user)
    return NextResponse.json(
      { message: 'Usuário criado com sucesso', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('=== REGISTER ROUTE ERROR ===')
    console.error('Error in register route:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      },
      { status: 500 }
    )
  }
}
