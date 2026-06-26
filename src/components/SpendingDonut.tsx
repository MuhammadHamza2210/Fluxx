import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useTransactions, useSettings } from '../hooks/useData'
import { useApp } from '../state/AppContext'
import { inMonth, expenseByCategory } from '../lib/finance'
import { formatMoney } from '../lib/format'

export default function SpendingDonut() {
  const txns = useTransactions() ?? []
  const { month } = useApp()
  const { currency } = useSettings()

  const data = expenseByCategory(inMonth(txns, month))
  const total = data.reduce((a, d) => a + d.value, 0)

  return (
    <div className="card flex h-full flex-col p-6">
      <h3 className="mb-1 font-display text-base font-semibold">Spending by category</h3>
      <p className="mb-4 text-xs text-[var(--muted)]">Where your money went this month</p>

      {data.length === 0 ? (
        <div className="grid flex-1 place-items-center py-10 text-sm text-[var(--muted)]">
          No expenses this month.
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center gap-4 sm:flex-row">
          <div className="relative h-44 w-44 shrink-0">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Total</div>
                <div className="font-display text-lg font-semibold">{formatMoney(total, currency, true)}</div>
              </div>
            </div>
          </div>

          <ul className="grid w-full flex-1 gap-2">
            {data.slice(0, 6).map((d) => (
              <li key={d.name} className="flex items-center gap-2.5 text-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
                <span className="flex-1 text-[var(--muted)]">{d.name}</span>
                <span className="font-medium">{formatMoney(d.value, currency, true)}</span>
                <span className="w-9 text-right text-xs text-[var(--muted)]">
                  {Math.round((d.value / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
