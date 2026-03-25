import { useState } from 'react'

interface AddItemFormProps {
  onAdd: (name: string, notes: string) => void
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), notes.trim())
    setName('')
    setNotes('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <div className="flex-1 space-y-2">
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full rounded-lg px-3 py-2.5 focus:outline-none"
          style={{ backgroundColor: 'var(--color-theme-surface)', color: 'var(--color-theme-fg)', border: '1px solid var(--color-theme-border)', boxShadow: 'none' }}
          onFocus={e => e.target.style.borderColor = 'var(--color-theme-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-theme-border)'}
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
          style={{ backgroundColor: 'var(--color-theme-surface)', color: 'var(--color-theme-fg)', border: '1px solid var(--color-theme-border)' }}
          onFocus={e => e.target.style.borderColor = 'var(--color-theme-primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-theme-border)'}
        />
      </div>
      <button
        type="submit"
        disabled={!name.trim()}
        className="self-start px-4 py-2.5 rounded-lg font-medium disabled:opacity-50"
        style={{ backgroundColor: 'var(--color-theme-primary)', color: 'var(--color-on-primary, #fff)' }}
      >
        Add
      </button>
    </form>
  )
}
