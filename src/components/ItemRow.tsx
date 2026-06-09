import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ListItem } from '../types'
import { Avatar } from './Avatar'

interface ItemRowProps {
  item: ListItem
  onDelete: () => void
  onNavigate: () => void
  isDragging?: boolean
}

export function ItemRow({ item, onDelete, onNavigate, isDragging }: ItemRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: 'var(--color-theme-surface)',
    border: '1px solid var(--color-theme-border)',
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout={!isDragging}
      layoutId={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 rounded-xl p-3"
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="touch-none w-11 h-11 flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
        style={{ color: 'var(--color-theme-border-strong)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </button>

      <div className="w-8 h-8 rounded-lg font-heading text-sm flex items-center justify-center shrink-0 font-bold" style={{ backgroundColor: 'color-mix(in srgb, var(--color-theme-primary) 20%, transparent)', color: 'var(--color-theme-primary)' }}>
        {item.rank}
      </div>

      <button className="flex-1 min-w-0 text-left" onClick={onNavigate}>
        <p className="font-medium break-words" style={{ color: 'var(--color-theme-fg)' }}>{item.name}</p>
        {item.cuisine && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.cuisine.split(',').map(c => c.trim()).filter(Boolean).map(c => (
              <span key={c} className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--color-theme-primary) 15%, transparent)', color: 'var(--color-theme-primary)' }}>{c}</span>
            ))}
          </div>
        )}
        {item.notes && (
          <p className="text-sm break-words mt-0.5" style={{ color: 'var(--color-theme-fg-muted)' }}>{item.notes}</p>
        )}
      </button>

      <Avatar name={item.addedBy} size={22} />

      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-theme-border-strong)', flexShrink: 0 }}>
        <path d="M9 18l6-6-6-6" />
      </svg>

      <button
        onClick={onDelete}
        aria-label="Delete item"
        className="w-11 h-11 flex items-center justify-center transition-colors hover:opacity-80 shrink-0"
        style={{ color: 'var(--color-theme-danger)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}
