import { motion } from 'framer-motion'
import type { FavoriteList } from '../types'
import { Avatar } from './Avatar'

interface ListCardProps {
  list: FavoriteList
  onClick: () => void
  onDelete: () => void
}

export function ListCard({ list, onClick, onDelete }: ListCardProps) {
  const activeItems = list.items.filter(i => !i.deletedAt)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white border border-orange-100 rounded-xl p-4 cursor-pointer hover:border-rose-200 hover:shadow-md transition-all group shadow-sm"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-stone-800 truncate">{list.name}</h3>
          <p className="text-sm text-stone-400 mt-1">{activeItems.length} items</p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <Avatar name={list.createdBy} size={20} />
        <span className="text-xs text-stone-400">{list.createdBy}</span>
      </div>
    </motion.div>
  )
}
