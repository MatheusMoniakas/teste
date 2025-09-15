const { Pool } = require('pg')
require('dotenv').config()

async function testConnection() {
  console.log('🔍 Testando conexão com PostgreSQL...')
  console.log('📋 Configurações:')
  console.log('   - Host: localhost')
  console.log('   - Port: 5432')
  console.log('   - Database: meu_banco')
  console.log('   - User: matheus')
  console.log('')

  // Verificar se a variável de ambiente está definida
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não encontrada no arquivo .env')
    return
  }

  console.log('🔗 String de conexão:', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@'))

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
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
    console.log('   2. O arquivo .env está configurado corretamente')
    console.log('   3. O usuário "matheus" tem permissão no banco "meu_banco"')
    console.log('   4. A senha está correta')
  } finally {
    await pool.end()
  }
}

testConnection()
