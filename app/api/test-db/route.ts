import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TEST DB ROUTE START ===')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL)
    
    if (!pool) {
      console.error('Pool is null')
      return NextResponse.json(
        { error: 'Database pool not initialized', pool: null },
        { status: 500 }
      )
    }

    console.log('Pool exists, testing connection...')
    const client = await pool.connect()
    
    try {
      // Testar query simples
      const result = await client.query('SELECT NOW() as current_time, version() as version')
      console.log('Query successful:', result.rows[0])
      
      // Verificar tabelas
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `)
      
      console.log('Tables found:', tablesResult.rows)
      
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        data: {
          current_time: result.rows[0].current_time,
          version: result.rows[0].version,
          tables: tablesResult.rows.map(row => row.table_name)
        }
      })
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('=== TEST DB ROUTE ERROR ===')
    console.error('Error:', error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: {
          NODE_ENV: process.env.NODE_ENV,
          DATABASE_URL_configured: !!process.env.DATABASE_URL,
          pool_exists: !!pool
        }
      },
      { status: 500 }
    )
  }
}
