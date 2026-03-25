import type { SyncStatus as SyncStatusType } from '../types'

const statusConfig: Record<SyncStatusType, { color: string; label: string }> = {
  synced: { color: 'bg-emerald-400', label: 'Synced' },
  syncing: { color: 'bg-amber-400 animate-pulse', label: 'Syncing' },
  offline: { color: 'bg-zinc-400', label: 'Offline' },
  error: { color: 'bg-red-400', label: 'Error' },
  conflict: { color: 'bg-orange-400', label: 'Conflict' },
}

export function SyncStatusIndicator({ status }: { status: SyncStatusType }) {
  const { color, label } = statusConfig[status]
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs text-zinc-400">{label}</span>
    </div>
  )
}
