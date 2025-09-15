import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validações básicas
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Criar usuário
    const user = await createUser(email, password, name)

    if (!user) {
      return NextResponse.json(
        { error: 'Erro ao criar usuário. Email já existe.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Usuário criado com sucesso', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in register route:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
