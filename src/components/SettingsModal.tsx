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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="rounded-2xl p-6 w-full max-w-md shadow-xl"
            style={{ backgroundColor: 'var(--color-theme-bg)', border: '1px solid var(--color-theme-border)' }}
          >
            <h2 className="text-xl font-heading font-bold mb-4" style={{ color: 'var(--color-theme-fg)' }}>What's your name?</h2>

            <input
              type="text"
              placeholder="Display name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className="w-full rounded-lg px-3 py-2.5 focus:outline-none theme-input"
              autoFocus
            />

            <div className="flex gap-2 mt-6">
              {initial && (
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-lg"
                  style={{ backgroundColor: 'var(--color-theme-surface)', color: 'var(--color-theme-fg)', border: '1px solid var(--color-theme-border)' }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!displayName}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium disabled:opacity-50 theme-btn-primary"
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
