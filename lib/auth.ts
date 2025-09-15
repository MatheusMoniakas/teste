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

  console.log('Pool configurado, tentando conectar...')
  const client = await pool.connect()
  
  try {
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
    return null
  } finally {
    client.release()
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
