const { Pool } = require('pg')
require('dotenv').config()

async function testConnection() {
  console.log('🔍 Testando conexão com PostgreSQL (método alternativo)...')
  console.log('📋 Configurações:')
  console.log('   - Host: localhost')
  console.log('   - Port: 5432')
  console.log('   - Database: meu_banco')
  console.log('   - User: matheus')
  console.log('   - Password: admin123')
  console.log('')

  // Usar configurações individuais em vez de connectionString
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'meu_banco',
    user: 'matheus',
    password: 'admin123',
    ssl: false,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  })

  try {
    const client = await pool.connect()
    console.log('✅ Conexão estabelecida com sucesso!')
    
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
      console.log('   ⚠️  Nenhuma tabela encontrada. Execute: npm run init-db')
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`)
      })
    }
    
    client.release()
    console.log('🎉 Teste de conexão concluído com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:')
    console.error('   ', error.message)
    console.log('')
    console.log('🔧 Verifique se:')
    console.log('   1. O PostgreSQL está rodando')
    console.log('   2. O banco "meu_banco" existe')
    console.log('   3. O usuário "matheus" existe e tem permissão')
    console.log('   4. A senha "admin123" está correta')
    console.log('   5. O PostgreSQL está na porta 5432')
    
    // Sugestões específicas para o erro SASL
    if (error.message.includes('SASL') || error.message.includes('password')) {
      console.log('')
      console.log('💡 Dicas para erro de autenticação:')
      console.log('   - Verifique se o usuário "matheus" foi criado no PostgreSQL')
      console.log('   - Confirme se a senha está correta')
      console.log('   - Tente recriar o usuário com: CREATE USER matheus WITH PASSWORD \'admin123\';')
      console.log('   - Conceda permissões: GRANT ALL PRIVILEGES ON DATABASE meu_banco TO matheus;')
    }
  } finally {
    await pool.end()
  }
}

testConnection()
