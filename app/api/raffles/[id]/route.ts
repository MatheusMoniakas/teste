import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getRaffleById, updateRaffle, deleteRaffle } from '@/lib/raffles'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const raffle = await getRaffleById(parseInt(params.id), user.id)

    if (!raffle) {
      return NextResponse.json(
        { error: 'Sorteio não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ raffle }, { status: 200 })
  } catch (error) {
    console.error('Error getting raffle:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const raffle = await updateRaffle(parseInt(params.id), user.id, name, items)

    if (!raffle) {
      return NextResponse.json(
        { error: 'Sorteio não encontrado ou erro ao atualizar' },
        { status: 404 }
      )
    }

    return NextResponse.json({ raffle }, { status: 200 })
  } catch (error) {
    console.error('Error updating raffle:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const success = await deleteRaffle(parseInt(params.id), user.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Sorteio não encontrado ou erro ao deletar' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Sorteio deletado com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting raffle:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
