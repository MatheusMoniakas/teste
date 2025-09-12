'use client'

import { useState } from 'react'

export default function Home() {
  const [items, setItems] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [winner, setWinner] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎲 Sorteio Aleatório
          </h1>
          <p className="text-gray-600">
            Adicione itens à lista e sorteie um vencedor!
          </p>
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
            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="btn-secondary text-sm"
              >
                Limpar Tudo
              </button>
            )}
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

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Feito com ❤️ para sorteios justos e aleatórios</p>
        </div>
      </div>
    </div>
  )
}
