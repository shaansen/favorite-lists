import { createClient, type SupabaseClient, type RealtimeChannel } from '@supabase/supabase-js'
import type { AppData } from '../types'

let client: SupabaseClient | null = null

export function initClient(url: string, anonKey: string) {
  client = createClient(url, anonKey)
}

function getClient(): SupabaseClient {
  if (!client) throw new Error('Supabase client not initialized')
  return client
}

export async function fetchData(): Promise<{ data: AppData; updatedAt: string }> {
  const { data, error } = await getClient()
    .from('app_data')
    .select('data, updated_at')
    .eq('id', 'singleton')
    .single()

  if (error) throw new Error(`Supabase fetch error: ${error.message}`)
  return { data: data.data as AppData, updatedAt: data.updated_at }
}

export async function writeData(
  appData: AppData,
  displayName: string,
  expectedUpdatedAt: string
): Promise<string> {
  const { data, error } = await getClient()
    .from('app_data')
    .update({ data: appData, updated_by: displayName, updated_at: new Date().toISOString() })
    .eq('id', 'singleton')
    .eq('updated_at', expectedUpdatedAt)
    .select('updated_at')
    .single()

  if (error || !data) throw new ConflictError()
  return data.updated_at
}

export async function initializeIfMissing(): Promise<string> {
  const { data: existing } = await getClient()
    .from('app_data')
    .select('updated_at')
    .eq('id', 'singleton')
    .single()

  if (existing) return existing.updated_at

  const { data, error } = await getClient()
    .from('app_data')
    .upsert({ id: 'singleton', data: { lists: [] } })
    .select('updated_at')
    .single()

  if (error) throw new Error(`Supabase init error: ${error.message}`)
  return data!.updated_at
}

export async function testConnection(url: string, anonKey: string): Promise<boolean> {
  try {
    const tempClient = createClient(url, anonKey)
    const { error } = await tempClient.from('app_data').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}

export function subscribe(callback: (data: AppData, updatedAt: string) => void): () => void {
  const channel: RealtimeChannel = getClient()
    .channel('app_data_changes')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'app_data', filter: 'id=eq.singleton' },
      (payload) => {
        const row = payload.new as { data: AppData; updated_at: string }
        callback(row.data, row.updated_at)
      }
    )
    .subscribe()

  return () => {
    getClient().removeChannel(channel)
  }
}

export class ConflictError extends Error {
  constructor() {
    super('Conflict: updated_at mismatch')
    this.name = 'ConflictError'
  }
}
