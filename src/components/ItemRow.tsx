import { motion } from 'framer-motion'
import type { ListItem } from '../types'
import { Avatar } from './Avatar'

interface ItemRowProps {
  item: ListItem
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}

export function ItemRow({ item, isFirst, isLast, onMoveUp, onMoveDown, onDelete }: ItemRowProps) {
  return (
    <motion.div
      layout
      layoutId={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3"
    >
      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-heading font-bold text-sm flex items-center justify-center shrink-0">
        {item.rank}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{item.name}</p>
        {item.notes && <p className="text-xs text-zinc-400 truncate">{item.notes}</p>}
      </div>

      <Avatar name={item.addedBy} size={22} />

      <div className="flex flex-col gap-0.5">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="text-zinc-500 hover:text-white disabled:opacity-20 p-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="text-zinc-500 hover:text-white disabled:opacity-20 p-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <button
        onClick={onDelete}
        className="text-zinc-500 hover:text-red-400 p-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}
