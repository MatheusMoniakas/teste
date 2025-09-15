import pool from './database'

export interface Raffle {
  id: number
  user_id: number
  name: string
  items: string[]
  created_at: string
  updated_at: string
}

export async function createRaffle(userId: number, name: string, items: string[]): Promise<Raffle | null> {
  if (!pool) {
    console.warn('PostgreSQL não configurado. Sorteio não pode ser salvo.')
    return null
  }

  const client = await pool.connect()
  
  try {
    const result = await client.query(
      'INSERT INTO raffles (user_id, name, items) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, items]
    )
    
    return result.rows[0]
  } catch (error) {
    console.error('Error creating raffle:', error)
    return null
  } finally {
    client.release()
  }
}

export async function getRafflesByUserId(userId: number): Promise<Raffle[]> {
  if (!pool) {
    console.warn('PostgreSQL não configurado. Nenhum sorteio encontrado.')
    return []
  }

  const client = await pool.connect()
  
  try {
    const result = await client.query(
      'SELECT * FROM raffles WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    )
    
    return result.rows
  } catch (error) {
    console.error('Error getting raffles by user id:', error)
    return []
  } finally {
    client.release()
  }
}

export async function getRaffleById(id: number, userId: number): Promise<Raffle | null> {
  if (!pool) {
    console.warn('PostgreSQL não configurado. Sorteio não encontrado.')
    return null
  }

  const client = await pool.connect()
  
  try {
    const result = await client.query(
      'SELECT * FROM raffles WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting raffle by id:', error)
    return null
  } finally {
    client.release()
  }
}

export async function updateRaffle(id: number, userId: number, name: string, items: string[]): Promise<Raffle | null> {
  if (!pool) {
    console.warn('PostgreSQL não configurado. Sorteio não pode ser atualizado.')
    return null
  }

  const client = await pool.connect()
  
  try {
    const result = await client.query(
      'UPDATE raffles SET name = $1, items = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, items, id, userId]
    )
    
    return result.rows[0] || null
  } catch (error) {
    console.error('Error updating raffle:', error)
    return null
  } finally {
    client.release()
  }
}

export async function deleteRaffle(id: number, userId: number): Promise<boolean> {
  if (!pool) {
    console.warn('PostgreSQL não configurado. Sorteio não pode ser deletado.')
    return false
  }

  const client = await pool.connect()
  
  try {
    const result = await client.query(
      'DELETE FROM raffles WHERE id = $1 AND user_id = $2',
      [id, userId]
    )
    
    return (result.rowCount || 0) > 0
  } catch (error) {
    console.error('Error deleting raffle:', error)
    return false
  } finally {
    client.release()
  }
}
