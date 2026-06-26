export type TxnType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TxnType
  amount: number // always positive; type decides sign
  category: string
  note?: string
  date: string // ISO 'yyyy-MM-dd'
  account?: string
  recurring?: boolean
  createdAt: number
}

export interface Budget {
  id: string
  category: string
  limit: number // monthly limit
}

export interface Goal {
  id: string
  name: string
  target: number
  saved: number
  color: string
  createdAt: number
}

export interface Account {
  id: string
  name: string
  type: 'cash' | 'bank' | 'card'
  balance: number
}

export interface Settings {
  id: 'app'
  currency: string
  name: string
}

export interface CategoryMeta {
  name: string
  color: string
}

// Expense categories with their signature colors (used across charts + UI).
export const EXPENSE_CATEGORIES: CategoryMeta[] = [
  { name: 'Food', color: '#f59e0b' },
  { name: 'Transport', color: '#22d3ee' },
  { name: 'Shopping', color: '#f472b6' },
  { name: 'Bills', color: '#a78bfa' },
  { name: 'Entertainment', color: '#34d399' },
  { name: 'Health', color: '#fb7185' },
  { name: 'Education', color: '#60a5fa' },
  { name: 'Other', color: '#94a3b8' },
]

export const INCOME_CATEGORIES: CategoryMeta[] = [
  { name: 'Salary', color: '#34d399' },
  { name: 'Freelance', color: '#22d3ee' },
  { name: 'Investments', color: '#a78bfa' },
  { name: 'Gifts', color: '#f472b6' },
  { name: 'Other', color: '#94a3b8' },
]

export function categoryColor(name: string): string {
  const all = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]
  return all.find((c) => c.name === name)?.color ?? '#94a3b8'
}

export const GOAL_COLORS = ['#7c5cff', '#22d3ee', '#34d399', '#f472b6', '#f59e0b', '#60a5fa']

export const CURRENCIES: Record<string, { symbol: string; locale: string }> = {
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  PKR: { symbol: '₨', locale: 'en-PK' },
  INR: { symbol: '₹', locale: 'en-IN' },
  AED: { symbol: 'د.إ', locale: 'ar-AE' },
  JPY: { symbol: '¥', locale: 'ja-JP' },
}
