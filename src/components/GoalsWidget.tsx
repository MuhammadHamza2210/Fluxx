import { Target } from 'lucide-react'
import { useGoals, useSettings } from '../hooks/useData'
import { goalProgress } from '../lib/finance'
import { formatMoney } from '../lib/format'

export default function GoalsWidget() {
  const goals = useGoals() ?? []
  const { currency } = useSettings()
  const items = goalProgress(goals).slice(0, 4)

  return (
    <div className="card flex h-full flex-col p-6">
      <div className="mb-4 flex items-center gap-2">
        <Target size={16} className="text-accent-glow" />
        <h3 className="font-display text-base font-semibold">Savings goals</h3>
      </div>

      {items.length === 0 ? (
        <div className="grid flex-1 place-items-center py-8 text-center text-sm text-[var(--muted)]">
          No goals yet. Create one in the Goals tab.
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((g) => (
            <li key={g.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">{g.name}</span>
                <span className="text-xs text-[var(--muted)]">
                  {formatMoney(g.saved, currency, true)} / {formatMoney(g.target, currency, true)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${g.pct * 100}%`, background: g.color }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
