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
      className="flex items-center gap-3 bg-white border border-orange-100 rounded-xl p-3 shadow-sm"
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none text-stone-300 hover:text-stone-500 p-1 cursor-grab active:cursor-grabbing"
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

      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-500 font-heading text-sm flex items-center justify-center shrink-0">
        {item.rank}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-stone-800 font-medium truncate">{item.name}</p>
        {item.notes && <p className="text-xs text-stone-400 truncate">{item.notes}</p>}
      </div>

      <Avatar name={item.addedBy} size={22} />

      <button
        onClick={onDelete}
        className="text-stone-300 hover:text-red-400 p-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}
