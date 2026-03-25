import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AppData, AppSettings, SyncStatus } from '../types'
import { useSettings } from '../hooks/useSettings'
import { useSync } from '../hooks/useSync'

interface AppContextValue {
  data: AppData
  status: SyncStatus
  settings: AppSettings | null
  setSettings: (s: AppSettings) => void
  updateData: (updater: (prev: AppData) => AppData) => void
  showSettings: boolean
  setShowSettings: (v: boolean) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { settings, setSettings } = useSettings()
  const { data, status, updateData } = useSync(settings)
  const [showSettings, setShowSettings] = useState(!settings)

  return (
    <AppContext.Provider value={{ data, status, settings, setSettings, updateData, showSettings, setShowSettings }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
