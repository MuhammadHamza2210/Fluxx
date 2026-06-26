import { Check, X } from 'lucide-react'
import ProgressRing from './ProgressRing'
import { useTransactions, useBudgets } from '../hooks/useData'
import { useApp } from '../state/AppContext'
import { inMonth, recentMonths, healthScore } from '../lib/finance'

export default function HealthScore() {
  const txns = useTransactions() ?? []
  const budgets = useBudgets() ?? []
  const { month } = useApp()

  const [prevKey] = recentMonths(2, month)
  const hs = healthScore(inMonth(txns, month), inMonth(txns, prevKey), budgets)

  const color = hs.score >= 80 ? '#34d399' : hs.score >= 60 ? '#7c5cff' : hs.score >= 40 ? '#f59e0b' : '#f43f5e'

  return (
    <div className="card flex h-full flex-col p-6">
      <h3 className="font-display text-base font-semibold">Financial health</h3>
      <p className="mb-4 text-xs text-[var(--muted)]">A quick read on this month</p>

      <div className="flex items-center gap-5">
        <ProgressRing pct={hs.score / 100} size={104} stroke={9} color={color}>
          <div className="text-center">
            <div className="font-display text-2xl font-bold" style={{ color }}>
              {hs.score}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-[var(--muted)]">/ 100</div>
          </div>
        </ProgressRing>
        <div>
          <div className="font-display text-lg font-semibold" style={{ color }}>
            {hs.label}
          </div>
          <p className="mt-1 max-w-[180px] text-xs leading-relaxed text-[var(--muted)]">
            Based on savings rate, budget adherence, and your spending trend.
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5 border-t border-white/[0.06] pt-4">
        {hs.factors.map((f) => (
          <li key={f.label} className="flex items-center gap-3 text-sm">
            <span
              className={`grid h-5 w-5 place-items-center rounded-full ${
                f.ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {f.ok ? <Check size={12} /> : <X size={12} />}
            </span>
            <span className="flex-1">{f.label}</span>
            <span className="text-xs text-[var(--muted)]">{f.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
