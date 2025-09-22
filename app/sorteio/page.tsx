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

export default function SorteioPage() {
  const { user, loading, logout } = useAuth()
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">🎲</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Sorteio Aleatório
          </h1>
          <p className="text-gray-600 text-lg">
            Adicione itens à lista e sorteie um vencedor!
          </p>
          
          {/* Auth Section */}
          <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
            {user ? (
              <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  Olá, <strong>{user.name}</strong>!
                </span>
                <button
                  onClick={async () => {
                    await logout()
                    window.location.reload()
                  }}
                  className="btn-secondary text-sm"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <Link
                  href="/"
                  className="btn-primary text-sm"
                >
                  Fazer Login
                </Link>
                <span className="text-gray-500">ou</span>
                <Link
                  href="/"
                  className="btn-secondary text-sm"
                >
                  Registrar
                </Link>
              </div>
            )}
            <Link
              href="/"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200"
            >
              ← Voltar ao início
            </Link>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite um nome ou número..."
              className="input-field flex-1 bg-white/50 border-gray-200 rounded-xl"
              maxLength={50}
            />
            <button
              onClick={addItem}
              disabled={!inputValue.trim() || items.includes(inputValue.trim())}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              ✨ Adicionar
            </button>
          </div>
          
          {inputValue.trim() && items.includes(inputValue.trim()) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              Este item já está na lista!
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              📋 Lista de Itens ({items.length})
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
                  🗑️ Limpar Tudo
                </button>
              )}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl font-medium mb-2">Lista vazia</p>
              <p>Adicione alguns itens para começar o sorteio!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200"
                >
                  <span className="text-gray-800 font-medium text-lg">{item}</span>
                  <button
                    onClick={() => removeItem(index)}
                    className="btn-danger text-sm"
                  >
                    ❌ Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Draw Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-white/20">
          <div className="text-center">
            <button
              onClick={drawWinner}
              disabled={items.length === 0 || isDrawing}
              className="btn-primary text-xl px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
            >
              {isDrawing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  🎲 Sorteando...
                </div>
              ) : (
                '🎯 Sortear Vencedor'
              )}
            </button>
          </div>

          {winner && !isDrawing && (
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white rounded-2xl p-8 shadow-2xl transform animate-pulse">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold mb-4">Parabéns!</h3>
                <p className="text-4xl font-bold bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  {winner}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Saved Raffles Section */}
        {user && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-white/20">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📚 Sorteios Salvos
            </h2>
            
            {loadingRaffles ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Carregando sorteios...</p>
              </div>
            ) : savedRaffles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-xl font-medium mb-2">Nenhum sorteio salvo</p>
                <p>Salve seus sorteios para reutilizá-los depois!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedRaffles.map((raffle) => (
                  <div
                    key={raffle.id}
                    className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{raffle.name}</h3>
                      <p className="text-sm text-gray-500">
                        {raffle.items.length} itens • {new Date(raffle.updated_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadRaffle(raffle)}
                        className="btn-primary text-sm"
                      >
                        📂 Carregar
                      </button>
                      <button
                        onClick={() => deleteRaffle(raffle.id)}
                        className="btn-danger text-sm"
                      >
                        🗑️ Deletar
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                💾 Salvar Sorteio
              </h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do sorteio
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Ex: Sorteio da Festa"
                  className="input-field bg-white/50 border-gray-200 rounded-xl"
                  maxLength={50}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={saveRaffle}
                  disabled={!saveName.trim()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💾 Salvar
                </button>
                <button
                  onClick={() => {
                    setShowSaveModal(false)
                    setSaveName('')
                  }}
                  className="btn-secondary flex-1"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-lg">Feito para sorteios justos e aleatórios</p>
            <p className="text-sm mt-1">🎲 Sorteio Aleatório - 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}

