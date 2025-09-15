const { Pool } = require('pg')

async function test() {
  console.log('Testando conexão...')
  
  const pool = new Pool({
    connectionString: 'postgresql://postgres:Matheus10032006@db.apbkobhfnmcqqzqeeqss.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  })

  try {
    const client = await pool.connect()
    console.log('✅ Conectado!')
    
    const result = await client.query('SELECT NOW()')
    console.log('Hora:', result.rows[0].now)
    
    client.release()
  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await pool.end()
  }
}

test()
