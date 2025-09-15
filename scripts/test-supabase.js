const { Pool } = require('pg')
require('dotenv').config()

async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...')
  
  // Usar a connection string do Supabase
  const connectionString = 'postgresql://postgres:Matheus10032006@db.apbkobhfnmcqqzqeeqss.supabase.co:5432/postgres'
  
  console.log('📋 Connection string:', connectionString.replace(/:[^:@]*@/, ':***@'))
  
  const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  })

  try {
    const client = await pool.connect()
    console.log('✅ Conectado ao Supabase com sucesso!')
    
    // Testar uma query simples
    const result = await client.query('SELECT NOW() as current_time')
    console.log('⏰ Hora atual do servidor:', result.rows[0].current_time)
    
    // Verificar se as tabelas existem
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    
    console.log('📊 Tabelas encontradas:')
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  Nenhuma tabela encontrada!')
      console.log('   Vamos criar as tabelas agora...')
      
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
      console.log('   ✅ Tabela users criada')
      
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
      console.log('   ✅ Tabela raffles criada')
      
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`)
      })
    }
    
    // Testar inserção de usuário
    console.log('🧪 Testando inserção de usuário...')
    try {
      const testResult = await client.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        ['teste@exemplo.com', 'senha_teste', 'Usuário Teste']
      )
      console.log('   ✅ Usuário de teste criado:', testResult.rows[0])
      
      // Deletar usuário de teste
      await client.query('DELETE FROM users WHERE email = $1', ['teste@exemplo.com'])
      console.log('   🗑️  Usuário de teste removido')
      
    } catch (insertError) {
      console.log('   ❌ Erro ao inserir usuário:', insertError.message)
    }
    
    client.release()
    console.log('🎉 Teste de conexão concluído com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao conectar com o Supabase:')
    console.error('   ', error.message)
    console.log('')
    console.log('🔧 Verifique se:')
    console.log('   1. A connection string está correta')
    console.log('   2. A senha está correta')
    console.log('   3. O projeto Supabase está ativo')
  } finally {
    await pool.end()
  }
}

testSupabaseConnection()
