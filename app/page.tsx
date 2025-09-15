'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

interface Raffle {
  id: number
  name: string
  items: string[]
  created_at: string
  updated_at: string
}

export default function Home() {
  const { user, loading } = useAuth()
  const [items, setItems] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [winner, setWinner] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [savedRaffles, setSavedRaffles] = useState<Raffle[]>([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [loadingRaffles, setLoadingRaffles] = useState(false)

  // Carregar sorteios salvos quando o usuário estiver logado
  useEffect(() => {
    if (user) {
      loadSavedRaffles()
    }
  }, [user])

  const loadSavedRaffles = async () => {
    setLoadingRaffles(true)
    try {
      const response = await fetch('/api/raffles')
      if (response.ok) {
        const data = await response.json()
        setSavedRaffles(data.raffles)
      }
    } catch (error) {
      console.error('Error loading raffles:', error)
    } finally {
      setLoadingRaffles(false)
    }
  }

  const addItem = () => {
    if (inputValue.trim() && !items.includes(inputValue.trim())) {
      setItems([...items, inputValue.trim()])
      setInputValue('')
      setWinner(null)
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
    setWinner(null)
  }

  const drawWinner = () => {
    if (items.length === 0) return
    
    setIsDrawing(true)
    setWinner(null)
    
    // Simula um sorteio com animação
    const drawInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * items.length)
      setWinner(items[randomIndex])
    }, 100)
    
    // Para a animação após 2 segundos
    setTimeout(() => {
      clearInterval(drawInterval)
      const finalWinner = items[Math.floor(Math.random() * items.length)]
      setWinner(finalWinner)
      setIsDrawing(false)
    }, 2000)
  }

  const clearAll = () => {
    setItems([])
    setWinner(null)
    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem()
    }
  }

  const saveRaffle = async () => {
    if (!saveName.trim() || items.length === 0) return

    try {
      const response = await fetch('/api/raffles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: saveName.trim(),
          items: items,
        }),
      })

      if (response.ok) {
        setShowSaveModal(false)
        setSaveName('')
        loadSavedRaffles()
        alert('Sorteio salvo com sucesso!')
      } else {
        alert('Erro ao salvar sorteio')
      }
    } catch (error) {
      console.error('Error saving raffle:', error)
      alert('Erro ao salvar sorteio')
    }
  }

  const loadRaffle = (raffle: Raffle) => {
    setItems(raffle.items)
    setWinner(null)
    setInputValue('')
  }

  const deleteRaffle = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este sorteio?')) return

    try {
      const response = await fetch(`/api/raffles/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadSavedRaffles()
        alert('Sorteio deletado com sucesso!')
      } else {
        alert('Erro ao deletar sorteio')
      }
    } catch (error) {
      console.error('Error deleting raffle:', error)
      alert('Erro ao deletar sorteio')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎲 Sorteio Aleatório
          </h1>
          <p className="text-gray-600">
            Adicione itens à lista e sorteie um vencedor!
          </p>
          
          {/* Auth Section */}
          <div className="mt-4">
            {user ? (
              <div className="flex items-center justify-center gap-4">
                <span className="text-gray-700">
                  Olá, <strong>{user.name}</strong>!
                </span>
                <button
                  onClick={() => {
                    fetch('/api/auth/logout', { method: 'POST' })
                    window.location.reload()
                  }}
                  className="btn-secondary text-sm"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary"
              >
                Fazer Login
              </Link>
            )}
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite um nome ou número..."
              className="input-field flex-1"
              maxLength={50}
            />
            <button
              onClick={addItem}
              disabled={!inputValue.trim() || items.includes(inputValue.trim())}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Adicionar
            </button>
          </div>
          
          {inputValue.trim() && items.includes(inputValue.trim()) && (
            <p className="text-red-500 text-sm">
              Este item já está na lista!
            </p>
          )}
        </div>

        {/* Items List */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Lista de Itens ({items.length})
            </h2>
            <div className="flex gap-2">
              {user && items.length > 0 && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="btn-primary text-sm"
                >
                  💾 Salvar
                </button>
              )}
              {items.length > 0 && (
                <button
                  onClick={clearAll}
                  className="btn-secondary text-sm"
                >
                  Limpar Tudo
                </button>
              )}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">📝 Lista vazia</p>
              <p>Adicione alguns itens para começar o sorteio!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-800 font-medium">{item}</span>
                  <button
                    onClick={() => removeItem(index)}
                    className="btn-danger text-sm"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Draw Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <button
              onClick={drawWinner}
              disabled={items.length === 0 || isDrawing}
              className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDrawing ? '🎲 Sorteando...' : '🎯 Sortear'}
            </button>
          </div>

          {winner && !isDrawing && (
            <div className="mt-6 text-center">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-2">🎉 Vencedor!</h3>
                <p className="text-3xl font-bold">{winner}</p>
              </div>
            </div>
          )}
        </div>

        {/* Saved Raffles Section */}
        {user && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📚 Sorteios Salvos
            </h2>
            
            {loadingRaffles ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Carregando sorteios...</p>
              </div>
            ) : savedRaffles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">📝 Nenhum sorteio salvo</p>
                <p>Salve seus sorteios para reutilizá-los depois!</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {savedRaffles.map((raffle) => (
                  <div
                    key={raffle.id}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{raffle.name}</h3>
                      <p className="text-sm text-gray-500">
                        {raffle.items.length} itens • {new Date(raffle.updated_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadRaffle(raffle)}
                        className="btn-primary text-sm"
                      >
                        Carregar
                      </button>
                      <button
                        onClick={() => deleteRaffle(raffle.id)}
                        className="btn-danger text-sm"
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Salvar Sorteio
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do sorteio
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Ex: Sorteio da Festa"
                  className="input-field"
                  maxLength={50}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={saveRaffle}
                  disabled={!saveName.trim()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setShowSaveModal(false)
                    setSaveName('')
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Feito com ❤️ para sorteios justos e aleatórios</p>
        </div>
      </div>
    </div>
  )
}
