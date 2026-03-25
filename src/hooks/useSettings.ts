import { useState, useCallback } from 'react'
import type { AppSettings } from '../types'
import { storage } from '../services/storage'

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings | null>(storage.getSettings)

  const setSettings = useCallback((s: AppSettings) => {
    storage.setSettings(s)
    setSettingsState(s)
  }, [])

  return { settings, setSettings }
}
