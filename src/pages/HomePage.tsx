import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { v4 as uuid } from 'uuid'
import { useApp } from '../context/AppContext'
import { ListCard } from '../components/ListCard'

export function HomePage() {
  const { data, updateData, settings } = useApp()
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')

  const activeLists = data.lists.filter(l => !l.deletedAt)

  const handleCreate = () => {
    if (!newName.trim() || !settings) return
    const id = uuid()
    updateData(prev => ({
      ...prev,
      lists: [...prev.lists, {
        id,
        name: newName.trim(),
        items: [],
        createdBy: settings.displayName,
        createdAt: new Date().toISOString(),
      }],
    }))
    setNewName('')
    setShowCreate(false)
    navigate(`/list/${id}`)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this list?')) return
    updateData(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === id ? { ...l, deletedAt: new Date().toISOString() } : l
      ),
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold" style={{ color: 'var(--color-theme-fg)' }}>Your Lists</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-lg font-medium text-sm"
          style={{ backgroundColor: 'var(--color-theme-primary)', color: '#fff' }}
        >
          + New List
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="List name (e.g. Favorite Hamburgers)"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                autoFocus
                className="flex-1 rounded-lg px-3 py-2.5 focus:outline-none"
                style={{ backgroundColor: 'var(--color-theme-surface)', color: 'var(--color-theme-fg)', border: '1px solid var(--color-theme-border)' }}
                onFocus={e => e.target.style.borderColor = 'var(--color-theme-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-theme-border)'}
              />
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="px-4 py-2.5 rounded-lg disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-theme-primary)', color: '#fff' }}
              >
                Create
              </button>
              <button
                onClick={() => { setShowCreate(false); setNewName('') }}
                className="px-3 py-2.5 rounded-lg"
                style={{ backgroundColor: 'var(--color-theme-surface)', color: 'var(--color-theme-fg)', border: '1px solid var(--color-theme-border)' }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-3">
        <AnimatePresence>
          {activeLists.map(list => (
            <ListCard
              key={list.id}
              list={list}
              onClick={() => navigate(`/list/${list.id}`)}
              onDelete={() => handleDelete(list.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {activeLists.length === 0 && !showCreate && (
        <div className="text-center py-16">
          <p className="text-lg" style={{ color: 'var(--color-theme-fg-muted)' }}>No lists yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-theme-border-strong)' }}>Create your first list to get started</p>
        </div>
      )}
    </div>
  )
}
