import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useTransactions, useSettings } from '../hooks/useData'
import { useApp } from '../state/AppContext'
import { inMonth, dailyBalanceSeries } from '../lib/finance'
import { formatMoney } from '../lib/format'

export default function CashFlowChart() {
  const txns = useTransactions() ?? []
  const { month } = useApp()
  const { currency } = useSettings()

  const data = dailyBalanceSeries(inMonth(txns, month), month)
  const last = data[data.length - 1]?.balance ?? 0

  return (
    <div className="card flex h-full flex-col p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">Cash flow</h3>
          <p className="text-xs text-[var(--muted)]">Running balance through the month</p>
        </div>
        <div className="text-right">
          <div className={`font-display text-lg font-semibold ${last >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
            {formatMoney(last, currency, true)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Month net</div>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="flowFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c5cff" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#7c5cff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#8b91a7', fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fill: '#8b91a7', fontSize: 11 }} tickLine={false} axisLine={false} width={48} />
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
              contentStyle={{
                background: 'rgba(15,18,32,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: '#e8eaf2',
                fontSize: 12,
              }}
              labelFormatter={(d) => `Day ${d}`}
              formatter={(v) => [formatMoney(Number(v), currency), 'Balance']}
            />
            <Area type="monotone" dataKey="balance" stroke="#7c5cff" strokeWidth={2.5} fill="url(#flowFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
