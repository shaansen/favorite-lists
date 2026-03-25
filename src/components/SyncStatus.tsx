import type { SyncStatus as SyncStatusType } from '../types'

const statusConfig: Record<SyncStatusType, { color: string; label: string }> = {
  synced: { color: '#2F8A5B', label: 'Synced' },
  syncing: { color: '#9E7422', label: 'Syncing' },
  offline: { color: '#A6BEB4', label: 'Offline' },
  error: { color: '#A13D34', label: 'Error' },
  conflict: { color: '#9E7422', label: 'Conflict' },
}

export function SyncStatusIndicator({ status }: { status: SyncStatusType }) {
  const { color, label } = statusConfig[status]
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${status === 'syncing' ? 'animate-pulse' : ''}`} style={{ backgroundColor: color }} />
      <span className="text-xs" style={{ color: 'var(--color-theme-fg-muted)' }}>{label}</span>
    </div>
  )
}
