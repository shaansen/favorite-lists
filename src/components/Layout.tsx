import type { ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { Avatar } from './Avatar'
import { SyncStatusIndicator } from './SyncStatus'
import { SettingsModal } from './SettingsModal'

export function Layout({ children }: { children: ReactNode }) {
  const { settings, setSettings, status, showSettings, setShowSettings } = useApp()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900">
      <nav className="sticky top-0 z-40 bg-indigo-950/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-heading font-bold text-lg text-white">FavLists</h1>
          <div className="flex items-center gap-3">
            <SyncStatusIndicator status={status} />
            {settings && (
              <button onClick={() => setShowSettings(true)} className="flex items-center gap-2">
                <Avatar name={settings.displayName} size={28} />
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>

      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={setSettings}
        initial={settings}
      />
    </div>
  )
}
