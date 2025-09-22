const { Pool } = require('pg')

// Diferentes formatos de connection string para testar
const connectionStrings = [
  // Formato 1: Pooling com usuário completo
  'postgresql://postgres.qrzzttxxerugiwkqwhvg:Matheus10032006%40@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
  
  // Formato 2: Pooling com usuário simples
  'postgresql://postgres:Matheus10032006%40@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
  
  // Formato 3: Pooling com usuário e senha sem encoding
  'postgresql://postgres.qrzzttxxerugiwkqwhvg:Matheus10032006@@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
  
  // Formato 4: Pooling com usuário simples e senha sem encoding
  'postgresql://postgres:Matheus10032006@@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
  
  // Formato 5: Direct connection (se funcionar)
  'postgresql://postgres:Matheus10032006%40@db.qrzzttxxerugiwkqwhvg.supabase.co:5432/postgres',
  
  // Formato 6: Direct connection sem encoding
  'postgresql://postgres:Matheus10032006@@db.qrzzttxxerugiwkqwhvg.supabase.co:5432/postgres'
]

async function testConnectionString(connectionString, index) {
  console.log(`\n🔍 Testando formato ${index + 1}:`)
  console.log(`📋 Connection string: ${connectionString.replace(/:[^:@]*@/, ':***@')}`)
  
  const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  })

  try {
    const client = await pool.connect()
    console.log(`✅ SUCESSO! Formato ${index + 1} funcionou!`)
    
    // Testar uma query simples
    const result = await client.query('SELECT NOW() as current_time')
    console.log(`⏰ Hora atual do servidor: ${result.rows[0].current_time}`)
    
    client.release()
    await pool.end()
    return connectionString
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`)
    await pool.end()
    return null
  }
}

async function testAllFormats() {
  console.log('🚀 Testando diferentes formatos de connection string...')
  console.log('📋 Projeto ID: qrzzttxxerugiwkqwhvg')
  console.log('🔑 Senha: Matheus10032006@')
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const workingString = await testConnectionString(connectionStrings[i], i)
    if (workingString) {
      console.log(`\n🎉 CONNECTION STRING FUNCIONANDO:`)
      console.log(`📋 ${workingString}`)
      break
    }
  }
  
  console.log('\n✅ Teste concluído!')
}

testAllFormats().catch(console.error)

