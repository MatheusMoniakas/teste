const net = require('net')

async function checkPostgreSQL() {
  console.log('🔍 Verificando se o PostgreSQL está rodando...')
  
  return new Promise((resolve) => {
    const socket = new net.Socket()
    
    socket.setTimeout(3000)
    
    socket.on('connect', () => {
      console.log('✅ PostgreSQL está rodando na porta 5432')
      socket.destroy()
      resolve(true)
    })
    
    socket.on('timeout', () => {
      console.log('❌ Timeout: PostgreSQL não está respondendo na porta 5432')
      socket.destroy()
      resolve(false)
    })
    
    socket.on('error', (err) => {
      console.log('❌ Erro ao conectar na porta 5432:', err.message)
      resolve(false)
    })
    
    socket.connect(5432, 'localhost')
  })
}

async function main() {
  const isRunning = await checkPostgreSQL()
  
  if (!isRunning) {
    console.log('')
    console.log('🔧 Para iniciar o PostgreSQL:')
    console.log('   Windows: net start postgresql-x64-14 (ou sua versão)')
    console.log('   Linux/Mac: sudo systemctl start postgresql')
    console.log('   Docker: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=admin123 postgres')
    console.log('')
    console.log('📋 Verifique também:')
    console.log('   1. Se o serviço PostgreSQL está instalado')
    console.log('   2. Se a porta 5432 não está sendo usada por outro processo')
    console.log('   3. Se o firewall não está bloqueando a conexão')
  } else {
    console.log('')
    console.log('🎉 PostgreSQL está funcionando!')
    console.log('   Agora você pode executar: npm run test-db-alt')
  }
}

main()
