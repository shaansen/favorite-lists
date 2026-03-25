import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AppSettings } from '../types'
import { testConnection } from '../services/github'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  onSave: (settings: AppSettings) => void
  initial?: AppSettings | null
}

export function SettingsModal({ open, onClose, onSave, initial }: SettingsModalProps) {
  const [displayName, setDisplayName] = useState(initial?.displayName ?? '')
  const [githubToken, setGithubToken] = useState(initial?.githubToken ?? '')
  const [repoOwner, setRepoOwner] = useState(initial?.repoOwner ?? '')
  const [repoName, setRepoName] = useState(initial?.repoName ?? 'favorite-lists')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<boolean | null>(null)

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    const ok = await testConnection(githubToken, repoOwner, repoName)
    setTestResult(ok)
    setTesting(false)
  }

  const handleSave = () => {
    if (!displayName || !githubToken || !repoOwner || !repoName) return
    onSave({ displayName, githubToken, repoOwner, repoName })
    onClose()
  }

  const isValid = displayName && githubToken && repoOwner && repoName

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
            <h2 className="text-xl font-heading font-bold text-white mb-4">Settings</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Display name"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 border border-zinc-700 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="GitHub Personal Access Token"
                value={githubToken}
                onChange={e => setGithubToken(e.target.value)}
                className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 border border-zinc-700 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Repo owner (GitHub username)"
                value={repoOwner}
                onChange={e => setRepoOwner(e.target.value)}
                className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 border border-zinc-700 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Repo name"
                value={repoName}
                onChange={e => setRepoName(e.target.value)}
                className="w-full bg-zinc-800 text-white rounded-lg px-3 py-2.5 border border-zinc-700 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleTest}
                disabled={!githubToken || !repoOwner || !repoName || testing}
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg text-sm hover:bg-zinc-600 disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
              {testResult !== null && (
                <span className={`text-sm ${testResult ? 'text-emerald-400' : 'text-red-400'}`}>
                  {testResult ? 'Connected!' : 'Failed'}
                </span>
              )}
            </div>

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
                disabled={!isValid}
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
