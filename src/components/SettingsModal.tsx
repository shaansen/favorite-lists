import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AppSettings } from '../types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  onSave: (settings: AppSettings) => void
  initial?: AppSettings | null
}

export function SettingsModal({ open, onClose, onSave, initial }: SettingsModalProps) {
  const [displayName, setDisplayName] = useState(initial?.displayName ?? '')

  const handleSave = () => {
    if (!displayName) return
    onSave({ displayName, supabaseUrl: SUPABASE_URL, supabaseAnonKey: SUPABASE_ANON_KEY })
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-700/50"
          >
            <h2 className="text-xl font-heading font-bold text-white mb-4">What's your name?</h2>

            <input
              type="text"
              placeholder="Display name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 border border-zinc-700 focus:border-indigo-500 focus:outline-none"
              autoFocus
            />

            <div className="flex gap-2 mt-6">
              {initial && (
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!displayName}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 font-medium"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
