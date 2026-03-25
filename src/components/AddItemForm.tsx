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
          className="w-full bg-white/5 text-white rounded-lg px-3 py-2.5 border border-white/10 focus:border-orange-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full bg-white/5 text-white rounded-lg px-3 py-2 border border-white/10 focus:border-orange-500 focus:outline-none text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={!name.trim()}
        className="self-start px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-400 disabled:opacity-50 font-medium"
      >
        Add
      </button>
    </form>
  )
}
