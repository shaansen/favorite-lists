import { motion, AnimatePresence } from 'framer-motion'
import type { AppSettings } from '../types'
import { Avatar } from './Avatar'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const USERS = ['Shantanu', 'Charlie'] as const

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  onSave: (settings: AppSettings) => void
  initial?: AppSettings | null
}

export function SettingsModal({ open, onClose, onSave, initial }: SettingsModalProps) {
  const handlePick = (name: string) => {
    onSave({ displayName: name, supabaseUrl: SUPABASE_URL, supabaseAnonKey: SUPABASE_ANON_KEY })
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
            className="rounded-2xl p-6 w-full max-w-sm shadow-xl"
            style={{ backgroundColor: 'var(--color-theme-bg)', border: '1px solid var(--color-theme-border)' }}
          >
            <h2 className="text-xl font-heading font-bold mb-6 text-center" style={{ color: 'var(--color-theme-fg)' }}>Who are you?</h2>

            <div className="flex gap-4 justify-center">
              {USERS.map(name => (
                <button
                  key={name}
                  onClick={() => handlePick(name)}
                  className="flex flex-col items-center gap-3 px-6 py-4 rounded-xl transition-all min-w-[120px]"
                  style={{
                    backgroundColor: initial?.displayName === name ? 'color-mix(in srgb, var(--color-theme-primary) 15%, transparent)' : 'var(--color-theme-surface)',
                    border: initial?.displayName === name ? '2px solid var(--color-theme-primary)' : '1px solid var(--color-theme-border)',
                  }}
                >
                  <Avatar name={name} size={56} />
                  <span className="font-medium" style={{ color: 'var(--color-theme-fg)' }}>{name}</span>
                </button>
              ))}
            </div>

            {initial && (
              <button
                onClick={onClose}
                className="w-full mt-4 px-4 py-2.5 rounded-lg text-sm"
                style={{ color: 'var(--color-theme-fg-muted)' }}
              >
                Cancel
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
