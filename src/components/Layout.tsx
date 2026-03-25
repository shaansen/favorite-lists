import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Avatar } from './Avatar'
import { SyncStatusIndicator } from './SyncStatus'
import { SettingsModal } from './SettingsModal'

export function Layout({ children }: { children: ReactNode }) {
  const { settings, setSettings, status, showSettings, setShowSettings } = useApp()

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-theme-bg)' }}>
      <nav className="sticky top-0 z-40 backdrop-blur-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--color-theme-bg) 80%, transparent)', borderBottom: '1px solid var(--color-theme-border)' }}>
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-heading text-lg font-bold" style={{ color: 'var(--color-theme-fg)' }}>Rank our Favorites</h1>
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

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--color-theme-bg) 90%, transparent)', borderTop: '1px solid var(--color-theme-border)' }}>
        <div className="max-w-2xl mx-auto flex">
          <NavLink
            to="/"
            end
            className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors"
            style={({ isActive }) => ({ color: isActive ? 'var(--color-theme-primary)' : 'var(--color-theme-fg-muted)' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            Rankings
          </NavLink>
          <NavLink
            to="/todos"
            className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors"
            style={({ isActive }) => ({ color: isActive ? 'var(--color-theme-primary)' : 'var(--color-theme-fg-muted)' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            To Do
          </NavLink>
        </div>
      </div>

      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={setSettings}
        initial={settings}
      />
    </div>
  )
}
