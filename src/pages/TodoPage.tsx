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
      <h2 className="font-heading text-2xl font-bold mb-4" style={{ color: 'var(--color-theme-fg)' }}>Things to Do</h2>

      <div className="space-y-2">
        <AnimatePresence>
          {incomplete.map(todo => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{ backgroundColor: 'var(--color-theme-surface)', border: '1px solid var(--color-theme-border)' }}
            >
              <button
                onClick={() => toggleComplete(todo.id)}
                className="shrink-0 w-6 h-6 rounded-full transition-colors"
                style={{ border: '2px solid var(--color-theme-border-strong)' }}
              />
              <p className="flex-1 min-w-0 truncate" style={{ color: 'var(--color-theme-fg)' }}>{todo.text}</p>
              <button onClick={() => handleDelete(todo.id)} className="p-1 hover:opacity-80" style={{ color: 'var(--color-theme-danger)' }}>
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
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-theme-fg-muted)' }}>Completed</p>
          <div className="space-y-2">
            <AnimatePresence>
              {completed.map(todo => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 rounded-xl p-3 opacity-60"
                  style={{ backgroundColor: 'var(--color-theme-surface)', border: '1px solid var(--color-theme-border)' }}
                >
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ border: '2px solid var(--color-theme-primary)', backgroundColor: 'color-mix(in srgb, var(--color-theme-primary) 20%, transparent)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-theme-primary)' }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </button>
                  <p className="flex-1 line-through min-w-0 truncate" style={{ color: 'var(--color-theme-fg-muted)' }}>{todo.text}</p>
                  <button onClick={() => handleDelete(todo.id)} className="p-1 hover:opacity-80" style={{ color: 'var(--color-theme-danger)' }}>
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
        <p className="text-center py-8" style={{ color: 'var(--color-theme-fg-muted)' }}>Nothing here yet. Add something below.</p>
      )}

      <form onSubmit={handleAdd} className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Add a to-do..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 rounded-lg px-3 py-2.5 focus:outline-none"
          style={{ backgroundColor: 'var(--color-theme-surface)', color: 'var(--color-theme-fg)', border: '1px solid var(--color-theme-border)' }}
          onFocus={e => e.target.style.borderColor = 'var(--color-theme-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-theme-border)'}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-4 py-2.5 rounded-lg font-medium disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-theme-primary)', color: '#fff' }}
        >
          Add
        </button>
      </form>
    </div>
  )
}
