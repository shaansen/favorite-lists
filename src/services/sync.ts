import type { AppData, SyncStatus } from '../types'
import { initClient, fetchData, writeData, initializeIfMissing, subscribeBroadcast, broadcastUpdate, ConflictError } from './supabase'
import { storage } from './storage'
import { mergeData } from '../utils/merge'

export type SyncListener = (data: AppData, status: SyncStatus) => void

export class SyncManager {
  private displayName = ''
  private unsubscribe: (() => void) | null = null
  private listener: SyncListener | null = null

  configure(url: string, anonKey: string, displayName: string) {
    initClient(url, anonKey)
    this.displayName = displayName
  }

  onUpdate(listener: SyncListener) {
    this.listener = listener
  }

  private emit(data: AppData, status: SyncStatus) {
    storage.setData(data)
    this.listener?.(data, status)
  }

  async initialize(): Promise<AppData> {
    try {
      const result = await fetchData()
      storage.setData(result.data)
      storage.setUpdatedAt(result.updatedAt)
      return result.data
    } catch {
      const updatedAt = await initializeIfMissing()
      const empty: AppData = { lists: [], todos: [] }
      storage.setData(empty)
      storage.setUpdatedAt(updatedAt)
      return empty
    }
  }

  startListening() {
    this.stopListening()
    this.unsubscribe = subscribeBroadcast(() => this.forceSync())
    window.addEventListener('online', this.handleOnline)
  }

  stopListening() {
    this.unsubscribe?.()
    this.unsubscribe = null
    window.removeEventListener('online', this.handleOnline)
  }

  private handleOnline = () => {
    this.flushQueue()
  }

  async push(data: AppData): Promise<void> {
    if (!navigator.onLine) {
      storage.enqueue(data)
      this.emit(data, 'offline')
      return
    }

    const updatedAt = storage.getUpdatedAt()
    if (!updatedAt) return

    try {
      this.listener?.(data, 'syncing')
      const newUpdatedAt = await writeData(data, this.displayName, updatedAt)
      storage.setUpdatedAt(newUpdatedAt)
      this.emit(data, 'synced')
      broadcastUpdate()
    } catch (e) {
      if (e instanceof ConflictError) {
        const result = await fetchData()
        const merged = mergeData(data, result.data)
        storage.setUpdatedAt(result.updatedAt)
        const newUpdatedAt = await writeData(merged, this.displayName, result.updatedAt)
        storage.setUpdatedAt(newUpdatedAt)
        this.emit(merged, 'synced')
        broadcastUpdate()
      } else {
        storage.enqueue(data)
        this.emit(data, 'error')
      }
    }
  }

  async forceSync(): Promise<AppData> {
    this.listener?.(storage.getData() ?? { lists: [], todos: [] }, 'syncing')
    const result = await fetchData()
    const local = storage.getData() ?? { lists: [], todos: [] }
    const merged = mergeData(local, result.data)
    storage.setUpdatedAt(result.updatedAt)
    this.emit(merged, 'synced')
    return merged
  }

  private async flushQueue() {
    const queue = storage.getQueue()
    if (queue.length === 0) return

    storage.clearQueue()
    const latest = queue[queue.length - 1].data
    const remote = await fetchData()
    storage.setUpdatedAt(remote.updatedAt)
    const merged = mergeData(latest, remote.data)
    await this.push(merged)
  }
}

export const syncManager = new SyncManager()
