import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { createRaffle, getRafflesByUserId } from '@/lib/raffles'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Token não encontrado' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const raffles = await getRafflesByUserId(user.id)

    return NextResponse.json({ raffles }, { status: 200 })
  } catch (error) {
    console.error('Error getting raffles:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Token não encontrado' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const { name, items } = await request.json()

    if (!name || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Nome e itens são obrigatórios' },
        { status: 400 }
      )
    }

    const raffle = await createRaffle(user.id, name, items)

    if (!raffle) {
      return NextResponse.json(
        { error: 'Erro ao criar sorteio' },
        { status: 500 }
      )
    }

    return NextResponse.json({ raffle }, { status: 201 })
  } catch (error) {
    console.error('Error creating raffle:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
