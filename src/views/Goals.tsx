import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import ProgressRing from '../components/ProgressRing'
import { useGoals, useSettings } from '../hooks/useData'
import { addGoal, updateGoal, deleteGoal } from '../lib/actions'
import { goalProgress } from '../lib/finance'
import { GOAL_COLORS } from '../types'
import { formatMoney, currencySymbol } from '../lib/format'

function AddFunds({ id, saved }: { id: string; saved: number }) {
  const [val, setVal] = useState('')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(val)
    if (Number.isFinite(n) && n !== 0) updateGoal(id, { saved: Math.max(0, saved + n) })
    setVal('')
  }
  return (
    <form onSubmit={submit} className="flex items-center gap-1.5">
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Add funds"
        className="input !py-1.5 text-sm"
      />
      <button type="submit" className="btn btn-ghost !px-2.5 !py-1.5" aria-label="Add funds">
        <Plus size={15} />
      </button>
    </form>
  )
}

export default function Goals() {
  const goals = useGoals() ?? []
  const { currency } = useSettings()
  const items = goalProgress(goals)

  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [color, setColor] = useState(GOAL_COLORS[0])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(target)
    if (!name.trim() || !Number.isFinite(n) || n <= 0) return
    await addGoal({ name: name.trim(), target: n, saved: 0, color })
    setName('')
    setTarget('')
  }

  return (
    <div className="space-y-4 pb-10">
      <form onSubmit={add} className="card flex flex-wrap items-end gap-3 p-5">
        <div className="min-w-[160px] flex-1">
          <label className="mb-1.5 block text-xs text-[var(--muted)]">Goal name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. New Laptop" className="input" />
        </div>
        <div className="w-36">
          <label className="mb-1.5 block text-xs text-[var(--muted)]">Target ({currencySymbol(currency)})</label>
          <input type="number" min="0" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="1000" className="input" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-[var(--muted)]">Color</label>
          <div className="flex gap-1.5">
            {GOAL_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="grid h-7 w-7 place-items-center rounded-full transition-transform hover:scale-110"
                style={{ background: c }}
                aria-label={`color ${c}`}
              >
                {color === c && <Check size={14} className="text-white" />}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          <Plus size={16} /> Add goal
        </button>
      </form>

      {items.length === 0 ? (
        <div className="card grid place-items-center py-16 text-sm text-[var(--muted)]">
          No savings goals yet — add your first one above.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => {
            const done = g.pct >= 1
            return (
              <div key={g.id} className="card flex flex-col p-6">
                <div className="flex items-start justify-between">
                  <ProgressRing pct={g.pct} size={84} color={g.color}>
                    <span className="font-display text-sm font-bold" style={{ color: g.color }}>
                      {Math.round(g.pct * 100)}%
                    </span>
                  </ProgressRing>
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                    aria-label="Delete goal"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{g.name}</h3>
                <p className="mt-0.5 text-sm text-[var(--muted)]">
                  {formatMoney(g.saved, currency, true)}{' '}
                  <span className="opacity-60">of {formatMoney(g.target, currency, true)}</span>
                </p>
                <div className="mt-4">
                  {done ? (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-300">
                      <Check size={15} /> Goal reached!
                    </div>
                  ) : (
                    <AddFunds id={g.id} saved={g.saved} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
