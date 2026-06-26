import { format, parseISO, subMonths } from 'date-fns'
import type { Transaction, Budget, Goal } from '../types'
import { categoryColor } from '../types'

export const monthKey = (d: Date | string) =>
  format(typeof d === 'string' ? parseISO(d) : d, 'yyyy-MM')

export const monthLabel = (key: string) => format(parseISO(`${key}-01`), 'MMMM yyyy')
export const shortMonth = (key: string) => format(parseISO(`${key}-01`), 'MMM')

export const currentMonthKey = () => format(new Date(), 'yyyy-MM')

/** N most recent month keys, oldest → newest, ending with `end` (default current). */
export function recentMonths(n: number, end: string = currentMonthKey()): string[] {
  const endDate = parseISO(`${end}-01`)
  return Array.from({ length: n }, (_, i) => monthKey(subMonths(endDate, n - 1 - i)))
}

export const inMonth = (txns: Transaction[], key: string) =>
  txns.filter((t) => monthKey(t.date) === key)

export interface Totals {
  income: number
  expense: number
  net: number
}

export function totals(txns: Transaction[]): Totals {
  let income = 0
  let expense = 0
  for (const t of txns) {
    if (t.type === 'income') income += t.amount
    else expense += t.amount
  }
  return { income, expense, net: income - expense }
}

export interface CategorySlice {
  name: string
  value: number
  color: string
}

export function expenseByCategory(txns: Transaction[]): CategorySlice[] {
  const map = new Map<string, number>()
  for (const t of txns) {
    if (t.type !== 'expense') continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value, color: categoryColor(name) }))
    .sort((a, b) => b.value - a.value)
}

export interface DayPoint {
  day: string // 'dd'
  balance: number
}

/** Running balance across the days of a month — drives the cash-flow area chart. */
export function dailyBalanceSeries(monthTxns: Transaction[], key: string): DayPoint[] {
  const sorted = [...monthTxns].sort((a, b) => a.date.localeCompare(b.date))
  const daysInMonth = new Date(
    Number(key.slice(0, 4)),
    Number(key.slice(5, 7)),
    0,
  ).getDate()
  const byDay = new Map<number, number>()
  for (const t of sorted) {
    const d = Number(t.date.slice(8, 10))
    const delta = t.type === 'income' ? t.amount : -t.amount
    byDay.set(d, (byDay.get(d) ?? 0) + delta)
  }
  const points: DayPoint[] = []
  let running = 0
  for (let d = 1; d <= daysInMonth; d++) {
    running += byDay.get(d) ?? 0
    points.push({ day: String(d).padStart(2, '0'), balance: Math.round(running) })
  }
  return points
}

export interface TrendPoint {
  month: string // short label
  key: string
  income: number
  expense: number
}

export function monthlyTrend(allTxns: Transaction[], months: number): TrendPoint[] {
  return recentMonths(months).map((key) => {
    const t = totals(inMonth(allTxns, key))
    return { month: shortMonth(key), key, income: t.income, expense: t.expense }
  })
}

export interface BudgetStatus {
  id: string
  category: string
  limit: number
  spent: number
  pct: number // 0..1+ (can exceed 1 when overspent)
  color: string
}

export function budgetStatus(budgets: Budget[], monthTxns: Transaction[]): BudgetStatus[] {
  const spentByCat = new Map<string, number>()
  for (const t of monthTxns) {
    if (t.type !== 'expense') continue
    spentByCat.set(t.category, (spentByCat.get(t.category) ?? 0) + t.amount)
  }
  return budgets
    .map((b) => {
      const spent = spentByCat.get(b.category) ?? 0
      return {
        id: b.id,
        category: b.category,
        limit: b.limit,
        spent,
        pct: b.limit > 0 ? spent / b.limit : 0,
        color: categoryColor(b.category),
      }
    })
    .sort((a, b) => b.pct - a.pct)
}

export interface GoalProgress extends Goal {
  pct: number
}

export const goalProgress = (goals: Goal[]): GoalProgress[] =>
  goals.map((g) => ({ ...g, pct: g.target > 0 ? Math.min(g.saved / g.target, 1) : 0 }))

export interface HealthScore {
  score: number // 0..100
  label: string
  savingsRate: number
  factors: { label: string; ok: boolean; detail: string }[]
}

/** A simple, explainable financial-health score for the selected month. */
export function healthScore(
  monthTxns: Transaction[],
  prevTxns: Transaction[],
  budgets: Budget[],
): HealthScore {
  const cur = totals(monthTxns)
  const prev = totals(prevTxns)
  const savingsRate = cur.income > 0 ? cur.net / cur.income : cur.expense > 0 ? -1 : 0

  // 1) Savings rate — up to 50 pts (20% savings → full marks)
  const savePts = Math.max(0, Math.min(savingsRate / 0.2, 1)) * 50

  // 2) Budget adherence — up to 30 pts
  const statuses = budgetStatus(budgets, monthTxns)
  const within = statuses.filter((s) => s.pct <= 1).length
  const budgetPts = statuses.length ? (within / statuses.length) * 30 : 18

  // 3) Spending trend vs last month — up to 20 pts
  let trendPts = 12
  if (prev.expense > 0) {
    const change = (cur.expense - prev.expense) / prev.expense
    trendPts = Math.max(0, Math.min((0.1 - change) / 0.2, 1)) * 20
  }

  const score = Math.round(Math.max(0, Math.min(savePts + budgetPts + trendPts, 100)))
  const label =
    score >= 80 ? 'Excellent' : score >= 60 ? 'Healthy' : score >= 40 ? 'Okay' : 'Needs work'

  const factors = [
    {
      label: 'Savings rate',
      ok: savingsRate >= 0.1,
      detail: `${Math.round(savingsRate * 100)}% of income saved`,
    },
    {
      label: 'Budgets',
      ok: statuses.length === 0 || within === statuses.length,
      detail: statuses.length ? `${within}/${statuses.length} within limit` : 'No budgets set',
    },
    {
      label: 'Spending trend',
      ok: prev.expense === 0 || cur.expense <= prev.expense,
      detail:
        prev.expense > 0
          ? `${cur.expense <= prev.expense ? '↓' : '↑'} vs last month`
          : 'No prior month',
    },
  ]

  return { score, label, savingsRate, factors }
}
