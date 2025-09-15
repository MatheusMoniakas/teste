const { Pool } = require('pg')

async function initSupabase() {
  console.log('🚀 Inicializando banco de dados no Supabase...')
  
  const pool = new Pool({
    connectionString: 'postgresql://postgres:Matheus10032006@db.apbkobhfnmcqqzqeeqss.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  })

  try {
    const client = await pool.connect()
    console.log('✅ Conectado ao Supabase!')
    
    // Criar tabela de usuários
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Tabela users criada/verificada')
    
    // Criar tabela de sorteios
    await client.query(`
      CREATE TABLE IF NOT EXISTS raffles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        items TEXT[] NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Tabela raffles criada/verificada')
    
    // Verificar tabelas
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    
    console.log('📊 Tabelas no banco:')
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`)
    })
    
    client.release()
    console.log('🎉 Banco de dados inicializado com sucesso no Supabase!')
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error.message)
  } finally {
    await pool.end()
  }
}

initSupabase()
