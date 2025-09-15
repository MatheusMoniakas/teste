import { Pool } from 'pg'

// Configuração do pool de conexões
let pool: Pool | null = null

try {
  console.log('Inicializando pool de conexão PostgreSQL...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'Não configurada')
  console.log('NODE_ENV:', process.env.NODE_ENV)
  
  // Configuração para produção (Netlify) ou desenvolvimento
  if (process.env.DATABASE_URL) {
    console.log('Usando DATABASE_URL para conexão...')
    // Usar string de conexão para produção
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })
  } else {
    console.log('Usando configuração local...')
    // Configuração local para desenvolvimento
    pool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'meu_banco',
      user: 'matheus',
      password: 'admin123',
      ssl: false
    })
  }
  
  // Testar conexão
  pool.on('connect', () => {
    console.log('✅ Conectado ao PostgreSQL')
  })
  
  pool.on('error', (err) => {
    console.error('❌ Erro na conexão PostgreSQL:', err)
  })
  
  console.log('Pool de conexão inicializado com sucesso')
} catch (error) {
  console.error('Erro ao inicializar pool PostgreSQL:', error)
  console.warn('PostgreSQL não configurado. Funcionalidades de banco de dados desabilitadas.')
}

export default pool

// Função para inicializar o banco de dados
export async function initDatabase() {
  if (!pool) {
    console.warn('PostgreSQL não configurado. Pule a inicialização do banco.')
    return
  }

  const client = await pool.connect()
  
  try {
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

    console.log('Database tables created successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
  } finally {
    client.release()
  }
}
