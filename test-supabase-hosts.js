const { Pool } = require('pg')

// Diferentes formatos de host para testar
const hostsToTest = [
  'db.qrzzttxxerugiwkqwhvg.supabase.co',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'db.qrzzttxxerugiwkqwhvg.supabase.co:5432',
  'postgres.qrzzttxxerugiwkqwhvg.supabase.co'
]

async function testHost(host) {
  console.log(`\n🔍 Testando host: ${host}`)
  
  let connectionString
  if (host.includes('pooler')) {
    connectionString = `postgresql://postgres.qrzzttxxerugiwkqwhvg:Matheus10032006%40@${host}:6543/postgres`
  } else {
    connectionString = `postgresql://postgres:Matheus10032006%40@${host}:5432/postgres`
  }
  
  console.log(`📋 Connection string: ${connectionString.replace(/:[^:@]*@/, ':***@')}`)
  
  const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  })

  try {
    const client = await pool.connect()
    console.log(`✅ SUCESSO! Conectado ao host: ${host}`)
    
    // Testar uma query simples
    const result = await client.query('SELECT NOW() as current_time')
    console.log(`⏰ Hora atual do servidor: ${result.rows[0].current_time}`)
    
    client.release()
    await pool.end()
    return true
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`)
    await pool.end()
    return false
  }
}

async function testAllHosts() {
  console.log('🚀 Testando diferentes hosts do Supabase...')
  console.log('📋 Projeto ID: qrzzttxxerugiwkqwhvg')
  console.log('🔑 Senha: Matheus10032006@')
  
  for (const host of hostsToTest) {
    const success = await testHost(host)
    if (success) {
      console.log(`\n🎉 HOST FUNCIONANDO: ${host}`)
      break
    }
  }
  
  console.log('\n✅ Teste concluído!')
}

testAllHosts().catch(console.error)

