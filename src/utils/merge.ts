import type { AppData, FavoriteList, ListItem } from '../types'

const TOMBSTONE_TTL = 24 * 60 * 60 * 1000

function mergeItems(local: ListItem[], remote: ListItem[]): ListItem[] {
  const map = new Map<string, ListItem>()
  for (const item of remote) map.set(item.id, item)
  for (const item of local) {
    const existing = map.get(item.id)
    if (!existing) {
      map.set(item.id, item)
    } else if (item.deletedAt && !existing.deletedAt) {
      map.set(item.id, item)
    }
  }
  return Array.from(map.values())
}

function mergeLists(local: FavoriteList[], remote: FavoriteList[]): FavoriteList[] {
  const map = new Map<string, FavoriteList>()
  for (const list of remote) map.set(list.id, { ...list })
  for (const list of local) {
    const existing = map.get(list.id)
    if (!existing) {
      map.set(list.id, list)
    } else {
      if (list.deletedAt && !existing.deletedAt) {
        existing.deletedAt = list.deletedAt
      }
      existing.items = mergeItems(list.items, existing.items)
    }
  }
  return Array.from(map.values())
}

function purgeTombstones(data: AppData): AppData {
  const cutoff = new Date(Date.now() - TOMBSTONE_TTL).toISOString()
  return {
    lists: data.lists
      .filter(l => !l.deletedAt || l.deletedAt > cutoff)
      .map(l => ({
        ...l,
        items: l.items.filter(i => !i.deletedAt || i.deletedAt > cutoff),
      })),
  }
}

export function mergeData(local: AppData, remote: AppData): AppData {
  const merged = { lists: mergeLists(local.lists, remote.lists) }
  return purgeTombstones(merged)
}
