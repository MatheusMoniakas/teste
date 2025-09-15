import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from './database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface User {
  id: number
  email: string
  name: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User
    return decoded
  } catch (error) {
    return null
  }
}

export async function createUser(email: string, password: string, name: string): Promise<User | null> {
  console.log('createUser called with:', { email, name, hasPassword: !!password })
  
  if (!pool) {
    console.error('PostgreSQL não configurado. Pool é null.')
    return null
  }

  let client = null
  try {
    console.log('Pool configurado, tentando conectar...')
    client = await pool.connect()
    console.log('Conectado ao banco, fazendo hash da senha...')
    
    const hashedPassword = await hashPassword(password)
    console.log('Senha hasheada, inserindo usuário...')
    
    const result = await client.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    )
    
    console.log('Usuário criado com sucesso:', result.rows[0])
    return result.rows[0]
  } catch (error) {
    console.error('Error creating user:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      detail: (error as any)?.detail
    })
    
    // Se for erro de conexão, tentar criar as tabelas
    if (error instanceof Error && (error.message.includes('relation') || error.message.includes('does not exist'))) {
      console.log('Tentando criar tabelas...')
      try {
        if (client) {
          await client.query(`
            CREATE TABLE IF NOT EXISTS users (
              id SERIAL PRIMARY KEY,
              email VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              name VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `)
          console.log('Tabela users criada, tentando inserir novamente...')
          
          const hashedPassword = await hashPassword(password)
          const result = await client.query(
            'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
            [email, hashedPassword, name]
          )
          return result.rows[0]
        }
      } catch (createError) {
        console.error('Erro ao criar tabelas:', createError)
      }
    }
    
    return null
  } finally {
    if (client) {
      client.release()
    }
  }
}

export async function getUserByEmail(email: string): Promise<(User & { password: string }) | null> {
  if (!pool) {
    console.warn('PostgreSQL não configurado. Usuário não encontrado.')
    return null
  }

  const client = await pool.connect()
  
  try {
    const result = await client.query(
      'SELECT id, email, name, password FROM users WHERE email = $1',
      [email]
    )
    
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  } finally {
    client.release()
  }
}

export async function getUserById(id: number): Promise<User | null> {
  if (!pool) {
    console.warn('PostgreSQL não configurado. Usuário não encontrado.')
    return null
  }

  const client = await pool.connect()
  
  try {
    const result = await client.query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [id]
    )
    
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting user by id:', error)
    return null
  } finally {
    client.release()
  }
}
