import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TESTE DE CONEXÃO COM BANCO ===')
    
    if (!pool) {
      console.log('Pool não configurado')
      return NextResponse.json({
        error: 'Pool de conexão não configurado',
        pool: null
      }, { status: 500 })
    }
    
    console.log('Pool configurado, testando conexão...')
    
    const client = await pool.connect()
    
    try {
      // Testar conexão básica
      const result = await client.query('SELECT NOW() as current_time')
      console.log('Conexão bem-sucedida:', result.rows[0])
      
      // Verificar se as tabelas existem
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'raffles')
      `)
      
      console.log('Tabelas encontradas:', tablesResult.rows)
      
      return NextResponse.json({
        message: 'Conexão com banco bem-sucedida',
        currentTime: result.rows[0].current_time,
        tables: tablesResult.rows,
        poolConfigured: true
      }, { status: 200 })
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Erro na conexão com banco:', error)
    return NextResponse.json({
      error: 'Erro na conexão com banco',
      details: error instanceof Error ? error.message : 'Unknown error',
      poolConfigured: !!pool
    }, { status: 500 })
  }
}