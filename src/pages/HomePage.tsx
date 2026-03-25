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
        <h2 className="font-heading font-bold text-2xl text-white">Your Lists</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 font-medium text-sm"
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
                className="flex-1 bg-white/5 text-white rounded-lg px-3 py-2.5 border border-white/10 focus:border-orange-500 focus:outline-none"
              />
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-400 disabled:opacity-50"
              >
                Create
              </button>
              <button
                onClick={() => { setShowCreate(false); setNewName('') }}
                className="px-3 py-2.5 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600"
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
          <p className="text-zinc-500 text-lg">No lists yet</p>
          <p className="text-zinc-600 text-sm mt-1">Create your first list to get started</p>
        </div>
      )}
    </div>
  )
}
