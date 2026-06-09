import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function ItemEditPage() {
  const { id, itemId } = useParams<{ id: string; itemId: string }>()
  const navigate = useNavigate()
  const { data, updateData } = useApp()

  const list = data.lists.find(l => l.id === id && !l.deletedAt)
  const item = list?.items.find(i => i.id === itemId && !i.deletedAt)

  const [name, setName] = useState(item?.name ?? '')
  const [notes, setNotes] = useState(item?.notes ?? '')
  const [cuisine, setCuisine] = useState(item?.cuisine ?? '')

  if (!list || !item) {
    return (
      <div className="text-center py-16">
        <p style={{ color: 'var(--color-theme-fg-muted)' }}>Item not found</p>
        <button onClick={() => navigate(-1)} className="mt-2" style={{ color: 'var(--color-theme-primary)' }}>Go back</button>
      </div>
    )
  }

  const save = () => {
    const trimmedName = name.trim()
    if (!trimmedName) return
    updateData(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === id
          ? {
              ...l,
              items: l.items.map(i =>
                i.id === itemId
                  ? { ...i, name: trimmedName, notes: notes.trim(), cuisine: cuisine.trim() }
                  : i
              ),
            }
          : l
      ),
    }))
    navigate(-1)
  }

  const labelStyle = { color: 'var(--color-theme-fg-muted)' }
  const inputClass = 'w-full rounded-xl px-4 py-3 focus:outline-none theme-input'

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        aria-label="Back"
        className="flex items-center gap-1 mb-6 text-sm min-h-[44px]"
        style={{ color: 'var(--color-theme-fg-muted)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {list.name}
      </button>

      <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--color-theme-fg)' }}>Edit item</h2>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide px-1" style={labelStyle}>Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            className={inputClass}
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide px-1" style={labelStyle}>Cuisine</label>
          <input
            value={cuisine}
            onChange={e => setCuisine(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            placeholder="e.g. Italian, Thai, BBQ…"
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide px-1" style={labelStyle}>Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Optional notes…"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <button
        onClick={save}
        disabled={!name.trim()}
        className="w-full mt-8 py-3 rounded-xl font-medium transition-opacity disabled:opacity-40"
        style={{ backgroundColor: 'var(--color-theme-primary)', color: '#fff' }}
      >
        Save
      </button>
    </div>
  )
}
