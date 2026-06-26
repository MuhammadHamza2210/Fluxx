import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useTransactions, useBudgets, useSettings } from '../hooks/useData'
import { useApp } from '../state/AppContext'
import { inMonth, budgetStatus } from '../lib/finance'
import { formatMoney } from '../lib/format'

export default function BudgetBars({ compact = false }: { compact?: boolean }) {
  const txns = useTransactions() ?? []
  const budgets = useBudgets() ?? []
  const { month } = useApp()
  const { currency } = useSettings()

  const statuses = budgetStatus(budgets, inMonth(txns, month))
  const shown = compact ? statuses.slice(0, 4) : statuses

  return (
    <div className="card flex h-full flex-col p-6">
      <h3 className="font-display text-base font-semibold">Budgets</h3>
      <p className="mb-4 text-xs text-[var(--muted)]">Spending against your monthly limits</p>

      {shown.length === 0 ? (
        <div className="grid flex-1 place-items-center py-8 text-center text-sm text-[var(--muted)]">
          No budgets yet. Add some in the Budgets tab.
        </div>
      ) : (
        <ul className="space-y-4">
          {shown.map((s) => {
            const over = s.pct > 1
            const width = Math.min(s.pct, 1) * 100
            return (
              <li key={s.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                    {s.category}
                    {over && <AlertTriangle size={13} className="text-rose-400" />}
                  </span>
                  <span className={over ? 'text-rose-300' : 'text-[var(--muted)]'}>
                    {formatMoney(s.spent, currency, true)}{' '}
                    <span className="text-[var(--muted)]">/ {formatMoney(s.limit, currency, true)}</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: over ? '#f43f5e' : s.color }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
