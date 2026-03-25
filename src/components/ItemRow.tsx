import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ListItem } from '../types'
import { Avatar } from './Avatar'

interface ItemRowProps {
  item: ListItem
  onDelete: () => void
  isDragging?: boolean
}

export function ItemRow({ item, onDelete, isDragging }: ItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id })

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
        className="touch-none p-1 cursor-grab active:cursor-grabbing"
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

      <div className="flex-1 min-w-0">
        <p className="font-medium break-words" style={{ color: 'var(--color-theme-fg)' }}>{item.name}</p>
        {item.notes && <p className="text-sm break-words" style={{ color: 'var(--color-theme-fg-muted)' }}>{item.notes}</p>}
      </div>

      <Avatar name={item.addedBy} size={22} />

      <button
        onClick={onDelete}
        className="p-1 transition-colors hover:opacity-80"
        style={{ color: 'var(--color-theme-danger)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}
