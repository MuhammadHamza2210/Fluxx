import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import TransactionList from '../components/TransactionList'
import { useTransactions, useSettings } from '../hooks/useData'
import { useApp } from '../state/AppContext'
import { inMonth, totals, monthLabel } from '../lib/finance'
import { formatMoney } from '../lib/format'
import type { TxnType } from '../types'

type Filter = 'all' | TxnType

export default function Transactions() {
  const txns = useTransactions() ?? []
  const { month } = useApp()
  const { currency } = useSettings()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const monthTxns = inMonth(txns, month)
  const t = totals(monthTxns)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return monthTxns
      .filter((x) => (filter === 'all' ? true : x.type === filter))
      .filter((x) =>
        q ? (x.note ?? '').toLowerCase().includes(q) || x.category.toLowerCase().includes(q) : true,
      )
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
  }, [monthTxns, query, filter])

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'income', label: 'Income' },
    { id: 'expense', label: 'Expenses' },
  ]

  return (
    <div className="space-y-4 pb-10">
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-xs text-[var(--muted)]">Income</div>
          <div className="font-display text-lg font-semibold text-emerald-300">{formatMoney(t.income, currency, true)}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-[var(--muted)]">Expenses</div>
          <div className="font-display text-lg font-semibold text-rose-300">{formatMoney(t.expense, currency, true)}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-[var(--muted)]">Net</div>
          <div className="font-display text-lg font-semibold">{formatMoney(t.net, currency, true)}</div>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5 rounded-xl bg-white/[0.04] p-1 ring-1 ring-white/[0.07]">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.id ? 'bg-white/10 text-white' : 'text-[var(--muted)] hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="input !w-56 pl-9"
            />
          </div>
        </div>

        <div className="mb-2 text-xs text-[var(--muted)]">
          {filtered.length} transaction{filtered.length === 1 ? '' : 's'} in {monthLabel(month)}
        </div>
        <TransactionList items={filtered} />
      </div>
    </div>
  )
}
