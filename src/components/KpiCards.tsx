import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react'
import AnimatedNumber from './AnimatedNumber'
import { useTransactions, useSettings } from '../hooks/useData'
import { useApp } from '../state/AppContext'
import { inMonth, totals, recentMonths } from '../lib/finance'
import { formatMoney } from '../lib/format'

function Delta({ value }: { value: number | null }) {
  if (value === null) return <span className="text-xs text-[var(--muted)]">—</span>
  const up = value >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(Math.round(value))}%
    </span>
  )
}

export default function KpiCards() {
  const txns = useTransactions() ?? []
  const { month } = useApp()
  const { currency } = useSettings()

  const [prevKey] = recentMonths(2, month) // [prev, current]
  const cur = totals(inMonth(txns, month))
  const prev = totals(inMonth(txns, prevKey))

  const pctChange = (c: number, p: number) => (p === 0 ? null : ((c - p) / Math.abs(p)) * 100)
  const savingsRate = cur.income > 0 ? (cur.net / cur.income) * 100 : 0

  const cards = [
    {
      label: 'Net this month',
      value: cur.net,
      delta: pctChange(cur.net, prev.net),
      icon: Wallet,
      tint: 'from-accent/25 to-accent/0 text-accent-glow',
      fmt: (n: number) => formatMoney(n, currency),
    },
    {
      label: 'Income',
      value: cur.income,
      delta: pctChange(cur.income, prev.income),
      icon: TrendingUp,
      tint: 'from-emerald-500/25 to-emerald-500/0 text-emerald-300',
      fmt: (n: number) => formatMoney(n, currency),
    },
    {
      label: 'Expenses',
      value: cur.expense,
      delta: pctChange(cur.expense, prev.expense),
      invertDelta: true,
      icon: TrendingDown,
      tint: 'from-rose-500/25 to-rose-500/0 text-rose-300',
      fmt: (n: number) => formatMoney(n, currency),
    },
    {
      label: 'Savings rate',
      value: savingsRate,
      delta: null,
      icon: PiggyBank,
      tint: 'from-cyan-500/25 to-cyan-500/0 text-cyan-300',
      fmt: (n: number) => `${Math.round(n)}%`,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = c.icon
        const delta = c.delta === null ? null : c.invertDelta ? -c.delta : c.delta
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="card relative overflow-hidden p-5"
          >
            <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${c.tint} blur-2xl`} />
            <div className="relative flex items-center justify-between">
              <span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${c.tint}`}>
                <Icon size={17} />
              </span>
              <Delta value={delta} />
            </div>
            <div className="relative mt-4 font-display text-2xl font-semibold tracking-tight">
              <AnimatedNumber value={c.value} format={c.fmt} />
            </div>
            <div className="relative mt-1 text-xs text-[var(--muted)]">{c.label}</div>
          </motion.div>
        )
      })}
    </div>
  )
}
