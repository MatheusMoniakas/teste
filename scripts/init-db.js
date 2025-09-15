const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'meu_banco',
  user: 'matheus',
  password: 'admin123',
  ssl: false
})

async function initDatabase() {
  const client = await pool.connect()
  
  try {
    console.log('Inicializando banco de dados...')
    
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
    console.log('✅ Tabela users criada')

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
    console.log('✅ Tabela raffles criada')

    console.log('🎉 Banco de dados inicializado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

initDatabase()
