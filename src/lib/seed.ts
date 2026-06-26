import { v4 as uuid } from 'uuid'
import { format, subMonths } from 'date-fns'
import { db } from '../db'
import type { Transaction, Budget, Goal, Account, Settings } from '../types'

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
const rand = (min: number, max: number) => Math.round(min + Math.random() * (max - min))

const EXPENSE_SAMPLES: Record<string, [string, number, number][]> = {
  // category: [note, min, max][]
  Food: [['Groceries', 25, 90], ['Restaurant', 12, 55], ['Coffee', 3, 8], ['Takeout', 10, 30]],
  Transport: [['Fuel', 30, 70], ['Ride', 6, 20], ['Bus pass', 15, 40]],
  Shopping: [['Clothes', 25, 120], ['Gadget', 20, 200], ['Home', 15, 80]],
  Bills: [['Electricity', 40, 110], ['Internet', 25, 45], ['Phone', 10, 30], ['Rent', 400, 700]],
  Entertainment: [['Movie', 8, 20], ['Subscription', 5, 18], ['Game', 10, 60]],
  Health: [['Pharmacy', 8, 40], ['Gym', 20, 45]],
  Education: [['Course', 15, 90], ['Books', 10, 45]],
}

export async function seedIfEmpty(): Promise<void> {
  const existing = await db.transactions.count()
  const hasSettings = await db.settings.get('app')
  if (existing > 0 || hasSettings) return

  const settings: Settings = { id: 'app', currency: 'USD', name: '' }

  const accounts: Account[] = [
    { id: uuid(), name: 'Cash', type: 'cash', balance: 320 },
    { id: uuid(), name: 'Bank', type: 'bank', balance: 4200 },
    { id: uuid(), name: 'Card', type: 'card', balance: 0 },
  ]

  const budgets: Budget[] = [
    { id: uuid(), category: 'Food', limit: 500 },
    { id: uuid(), category: 'Transport', limit: 200 },
    { id: uuid(), category: 'Shopping', limit: 300 },
    { id: uuid(), category: 'Bills', limit: 900 },
    { id: uuid(), category: 'Entertainment', limit: 150 },
  ]

  const goals: Goal[] = [
    { id: uuid(), name: 'New Laptop', target: 1400, saved: 620, color: '#7c5cff', createdAt: Date.now() },
    { id: uuid(), name: 'Emergency Fund', target: 3000, saved: 1850, color: '#22d3ee', createdAt: Date.now() },
    { id: uuid(), name: 'Trip', target: 1000, saved: 240, color: '#34d399', createdAt: Date.now() },
  ]

  const txns: Transaction[] = []
  const categories = Object.keys(EXPENSE_SAMPLES)

  // 3 months of history (this month + 2 previous)
  for (let m = 2; m >= 0; m--) {
    const base = subMonths(new Date(), m)
    const year = base.getFullYear()
    const month = base.getMonth() // 0-indexed
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()
    const maxDay = m === 0 ? today.getDate() : daysInMonth

    // monthly salary on the 1st
    txns.push({
      id: uuid(),
      type: 'income',
      amount: 2600,
      category: 'Salary',
      note: 'Monthly salary',
      account: 'Bank',
      date: format(new Date(year, month, 1), 'yyyy-MM-dd'),
      recurring: true,
      createdAt: Date.now() + txns.length,
    })
    // an occasional freelance income
    if (Math.random() > 0.4) {
      txns.push({
        id: uuid(),
        type: 'income',
        amount: rand(150, 600),
        category: 'Freelance',
        note: 'Freelance project',
        account: 'Bank',
        date: format(new Date(year, month, rand(8, 20)), 'yyyy-MM-dd'),
        createdAt: Date.now() + txns.length,
      })
    }

    // 18–26 expenses spread through the month
    const count = rand(18, 26)
    for (let i = 0; i < count; i++) {
      const cat = pick(categories)
      const [note, min, max] = pick(EXPENSE_SAMPLES[cat])
      // rent only once near the start
      if (note === 'Rent' && txns.some((t) => t.note === 'Rent' && t.date.startsWith(format(base, 'yyyy-MM')))) {
        continue
      }
      txns.push({
        id: uuid(),
        type: 'expense',
        amount: rand(min, max),
        category: cat,
        note,
        account: pick(['Cash', 'Bank', 'Card']),
        date: format(new Date(year, month, rand(1, maxDay)), 'yyyy-MM-dd'),
        createdAt: Date.now() + txns.length,
      })
    }
  }

  await db.settings.put(settings)
  await db.accounts.bulkPut(accounts)
  await db.budgets.bulkPut(budgets)
  await db.goals.bulkPut(goals)
  await db.transactions.bulkPut(txns)
}
