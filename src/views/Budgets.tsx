import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import BudgetBars from '../components/BudgetBars'
import { useBudgets, useSettings } from '../hooks/useData'
import { setBudget, deleteBudget } from '../lib/actions'
import { EXPENSE_CATEGORIES, categoryColor } from '../types'
import { currencySymbol } from '../lib/format'

export default function Budgets() {
  const budgets = useBudgets() ?? []
  const { currency } = useSettings()
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].name)
  const [limit, setLimit] = useState('')

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(limit)
    if (!Number.isFinite(n) || n <= 0) return
    await setBudget(category, n)
    setLimit('')
  }

  return (
    <div className="grid gap-4 pb-10 lg:grid-cols-2">
      <BudgetBars />

      <div className="card flex flex-col p-6">
        <h3 className="font-display text-base font-semibold">Manage budgets</h3>
        <p className="mb-4 text-xs text-[var(--muted)]">Set a monthly spending limit per category.</p>

        <form onSubmit={add} className="mb-5 flex items-end gap-2">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs text-[var(--muted)]">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.name} value={c.name} className="bg-ink-800">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="mb-1.5 block text-xs text-[var(--muted)]">Limit ({currencySymbol(currency)})</label>
            <input
              type="number"
              min="0"
              step="1"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="0"
              className="input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Plus size={16} />
          </button>
        </form>

        {budgets.length === 0 ? (
          <div className="grid flex-1 place-items-center py-6 text-sm text-[var(--muted)]">No budgets set yet.</div>
        ) : (
          <ul className="space-y-2">
            {budgets.map((b) => (
              <li key={b.id} className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: categoryColor(b.category) }} />
                <span className="flex-1 text-sm font-medium">{b.category}</span>
                <div className="flex items-center gap-1 text-sm text-[var(--muted)]">
                  {currencySymbol(currency)}
                  <input
                    type="number"
                    min="0"
                    defaultValue={b.limit}
                    onBlur={(e) => {
                      const n = Number(e.target.value)
                      if (Number.isFinite(n) && n > 0 && n !== b.limit) setBudget(b.category, n)
                    }}
                    className="input !w-24 !py-1 text-right"
                  />
                </div>
                <button
                  onClick={() => deleteBudget(b.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                  aria-label="Delete budget"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
