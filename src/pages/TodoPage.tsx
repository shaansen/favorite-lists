import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import type { TodoItem } from '../types'

export function TodoPage() {
  const { data, updateData, settings } = useApp()
  const [text, setText] = useState('')

  const activeTodos = (data.todos ?? []).filter(t => !t.deletedAt)
  const incomplete = activeTodos.filter(t => !t.completedAt)
  const completed = activeTodos.filter(t => t.completedAt)

  const updateTodos = (updater: (todos: TodoItem[]) => TodoItem[]) => {
    updateData(prev => ({ ...prev, todos: updater(prev.todos ?? []) }))
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !settings) return
    updateTodos(todos => [...todos, {
      id: uuid(),
      text: text.trim(),
      addedBy: settings.displayName,
    }])
    setText('')
  }

  const toggleComplete = (id: string) => {
    updateTodos(todos =>
      todos.map(t =>
        t.id === id
          ? { ...t, completedAt: t.completedAt ? undefined : new Date().toISOString() }
          : t
      )
    )
  }

  const handleDelete = (id: string) => {
    updateTodos(todos =>
      todos.map(t => t.id === id ? { ...t, deletedAt: new Date().toISOString() } : t)
    )
  }

  return (
    <div>
      <h2 className="font-heading text-2xl text-stone-800 mb-4">Things to Do</h2>

      <div className="space-y-2">
        <AnimatePresence>
          {incomplete.map(todo => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 bg-white border border-orange-100 rounded-xl p-3 shadow-sm"
            >
              <button onClick={() => toggleComplete(todo.id)} className="shrink-0 w-6 h-6 rounded-full border-2 border-rose-300 hover:border-rose-500 transition-colors" />
              <p className="flex-1 text-stone-800 min-w-0 truncate">{todo.text}</p>
              <button onClick={() => handleDelete(todo.id)} className="text-stone-300 hover:text-red-400 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {completed.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-stone-400 uppercase tracking-wider mb-2">Completed</p>
          <div className="space-y-2">
            <AnimatePresence>
              {completed.map(todo => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 bg-white/60 border border-orange-50 rounded-xl p-3 opacity-60"
                >
                  <button onClick={() => toggleComplete(todo.id)} className="shrink-0 w-6 h-6 rounded-full border-2 border-rose-400 bg-rose-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </button>
                  <p className="flex-1 text-stone-400 line-through min-w-0 truncate">{todo.text}</p>
                  <button onClick={() => handleDelete(todo.id)} className="text-stone-300 hover:text-red-400 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {incomplete.length === 0 && completed.length === 0 && (
        <p className="text-stone-400 text-center py-8">Nothing here yet. Add something below.</p>
      )}

      <form onSubmit={handleAdd} className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Add a to-do..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 bg-white text-stone-800 rounded-lg px-3 py-2.5 border border-orange-200 focus:border-rose-400 focus:outline-none placeholder:text-stone-300"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-4 py-2.5 bg-rose-500 text-white rounded-lg hover:bg-rose-400 disabled:opacity-50 font-medium"
        >
          Add
        </button>
      </form>
    </div>
  )
}
