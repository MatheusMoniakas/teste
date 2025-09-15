import { Pool } from 'pg'

// Configuração do pool de conexões
let pool: Pool | null = null

try {
  pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'meu_banco',
    user: 'matheus',
    password: 'admin123',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })
  
  // Testar conexão
  pool.on('connect', () => {
    console.log('✅ Conectado ao PostgreSQL')
  })
  
  pool.on('error', (err) => {
    console.error('❌ Erro na conexão PostgreSQL:', err)
  })
} catch (error) {
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
