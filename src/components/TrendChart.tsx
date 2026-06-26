import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { useTransactions, useSettings } from '../hooks/useData'
import { monthlyTrend } from '../lib/finance'
import { formatMoney } from '../lib/format'

export default function TrendChart() {
  const txns = useTransactions() ?? []
  const { currency } = useSettings()
  const data = monthlyTrend(txns, 6)

  return (
    <div className="card flex h-full flex-col p-6">
      <h3 className="font-display text-base font-semibold">Income vs expenses</h3>
      <p className="mb-4 text-xs text-[var(--muted)]">Last 6 months</p>

      <div className="h-56 w-full">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#8b91a7', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#8b91a7', fontSize: 11 }} tickLine={false} axisLine={false} width={48} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{
                background: 'rgba(15,18,32,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: '#e8eaf2',
                fontSize: 12,
              }}
              formatter={(v, name) => [formatMoney(Number(v), currency), name === 'income' ? 'Income' : 'Expenses']}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(v) => <span className="text-xs capitalize text-[var(--muted)]">{v}</span>}
            />
            <Bar dataKey="income" fill="#34d399" radius={[5, 5, 0, 0]} maxBarSize={26} />
            <Bar dataKey="expense" name="expenses" fill="#f472b6" radius={[5, 5, 0, 0]} maxBarSize={26} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
