import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { v4 as uuid } from 'uuid'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import type { ListItem } from '../types'
import { useApp } from '../context/AppContext'
import { ItemRow } from '../components/ItemRow'
import { AddItemForm } from '../components/AddItemForm'
import { Avatar } from '../components/Avatar'

export function ListDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, updateData, settings } = useApp()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  const list = data.lists.find(l => l.id === id)
  if (!list || list.deletedAt) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-400">List not found</p>
        <button onClick={() => navigate('/')} className="text-rose-500 mt-2">Go back</button>
      </div>
    )
  }

  const activeItems = list.items
    .filter(i => !i.deletedAt)
    .sort((a, b) => a.rank - b.rank)

  const activeItem = activeItems.find(i => i.id === activeId)

  const updateList = (updater: (items: ListItem[]) => ListItem[]) => {
    updateData(prev => ({
      ...prev,
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = activeItems.findIndex(i => i.id === active.id)
    const newIndex = activeItems.findIndex(i => i.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    const reordered = arrayMove(activeItems, oldIndex, newIndex)
    const rankMap = new Map(reordered.map((item, idx) => [item.id, idx + 1]))

    updateList(items =>
      items.map(i => {
        const newRank = rankMap.get(i.id)
        return newRank != null ? { ...i, rank: newRank } : i
      })
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-stone-400 hover:text-stone-700 mb-4 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h2 className="font-heading text-2xl text-stone-800 mb-4">{list.name}</h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={activeItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            <AnimatePresence>
              {activeItems.map(item => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onDelete={() => handleDelete(item.id)}
                  isDragging={item.id === activeId}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem && (
            <div className="flex items-center gap-3 bg-white border border-orange-200 rounded-xl p-3 shadow-xl">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-500 font-heading text-sm flex items-center justify-center shrink-0">
                {activeItem.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-stone-800 font-medium truncate">{activeItem.name}</p>
                {activeItem.notes && <p className="text-xs text-stone-400 truncate">{activeItem.notes}</p>}
              </div>
              <Avatar name={activeItem.addedBy} size={22} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {activeItems.length === 0 && (
        <p className="text-stone-400 text-center py-8">No items yet. Add the first one below.</p>
      )}

      <AddItemForm onAdd={handleAdd} />
    </div>
  )
}
