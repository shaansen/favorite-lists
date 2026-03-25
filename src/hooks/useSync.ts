import { useEffect, useRef, useCallback, useState } from 'react'
import type { AppData, AppSettings, SyncStatus } from '../types'
import { syncManager } from '../services/sync'
import { storage } from '../services/storage'

export function useSync(settings: AppSettings | null) {
  const [data, setData] = useState<AppData>(storage.getData() ?? { lists: [], todos: [] })
  const [status, setStatus] = useState<SyncStatus>('synced')
  const initialized = useRef(false)

  useEffect(() => {
    if (!settings || initialized.current) return
    initialized.current = true

    syncManager.configure(settings.supabaseUrl, settings.supabaseAnonKey, settings.displayName)
    syncManager.onUpdate((newData, newStatus) => {
      setData(newData)
      setStatus(newStatus)
    })

    syncManager.initialize().then(d => {
      setData(d)
      setStatus('synced')
      syncManager.startListening()
    }).catch(() => {
      setStatus('error')
    })

    return () => syncManager.stopListening()
  }, [settings])

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const next = updater(prev)
      storage.setData(next)
      syncManager.push(next)
      return next
    })
  }, [])

  return { data, status, updateData }
}
