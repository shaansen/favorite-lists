import { useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { v4 as uuid } from 'uuid'
import type { ListItem } from '../types'
import { useApp } from '../context/AppContext'
import { ItemRow } from '../components/ItemRow'
import { AddItemForm } from '../components/AddItemForm'

export function ListDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, updateData, settings } = useApp()

  const list = data.lists.find(l => l.id === id)
  if (!list || list.deletedAt) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-400">List not found</p>
        <button onClick={() => navigate('/')} className="text-indigo-400 mt-2">Go back</button>
      </div>
    )
  }

  const activeItems = list.items
    .filter(i => !i.deletedAt)
    .sort((a, b) => a.rank - b.rank)

  const updateList = (updater: (items: ListItem[]) => ListItem[]) => {
    updateData(prev => ({
      lists: prev.lists.map(l =>
        l.id === id ? { ...l, items: updater(l.items) } : l
      ),
    }))
  }

  const handleAdd = (name: string, notes: string) => {
    if (!settings) return
    const maxRank = activeItems.reduce((max, i) => Math.max(max, i.rank), 0)
    updateList(items => [...items, {
      id: uuid(),
      name,
      notes,
      rank: maxRank + 1,
      addedBy: settings.displayName,
    }])
  }

  const handleDelete = (itemId: string) => {
    updateList(items =>
      items.map(i => i.id === itemId ? { ...i, deletedAt: new Date().toISOString() } : i)
    )
  }

  const handleMove = (itemId: string, direction: 'up' | 'down') => {
    const idx = activeItems.findIndex(i => i.id === itemId)
    if (idx < 0) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= activeItems.length) return

    const rankA = activeItems[idx].rank
    const rankB = activeItems[swapIdx].rank

    updateList(items =>
      items.map(i => {
        if (i.id === activeItems[idx].id) return { ...i, rank: rankB }
        if (i.id === activeItems[swapIdx].id) return { ...i, rank: rankA }
        return i
      })
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-zinc-400 hover:text-white mb-4 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h2 className="font-heading font-bold text-2xl text-white mb-4">{list.name}</h2>

      <div className="space-y-2">
        <AnimatePresence>
          {activeItems.map((item, idx) => (
            <ItemRow
              key={item.id}
              item={item}
              isFirst={idx === 0}
              isLast={idx === activeItems.length - 1}
              onMoveUp={() => handleMove(item.id, 'up')}
              onMoveDown={() => handleMove(item.id, 'down')}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {activeItems.length === 0 && (
        <p className="text-zinc-500 text-center py-8">No items yet. Add the first one below.</p>
      )}

      <AddItemForm onAdd={handleAdd} />
    </div>
  )
}
