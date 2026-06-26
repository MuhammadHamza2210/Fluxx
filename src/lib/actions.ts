import { v4 as uuid } from 'uuid'
import { db } from '../db'
import type { Transaction, Budget, Goal, Settings } from '../types'

// ---- Transactions ----
export async function addTransaction(t: Omit<Transaction, 'id' | 'createdAt'>) {
  await db.transactions.add({ ...t, id: uuid(), createdAt: Date.now() })
}
export async function updateTransaction(id: string, patch: Partial<Transaction>) {
  await db.transactions.update(id, patch)
}
export async function deleteTransaction(id: string) {
  await db.transactions.delete(id)
}
export async function importTransactions(txns: Transaction[]) {
  await db.transactions.bulkPut(txns)
}

// ---- Budgets ----
export async function setBudget(category: string, limit: number) {
  const existing = await db.budgets.where('category').equals(category).first()
  if (existing) await db.budgets.update(existing.id, { limit })
  else await db.budgets.add({ id: uuid(), category, limit })
}
export async function deleteBudget(id: string) {
  await db.budgets.delete(id)
}
export const updateBudget = (b: Budget) => db.budgets.put(b)

// ---- Goals ----
export async function addGoal(g: Omit<Goal, 'id' | 'createdAt'>) {
  await db.goals.add({ ...g, id: uuid(), createdAt: Date.now() })
}
export async function updateGoal(id: string, patch: Partial<Goal>) {
  await db.goals.update(id, patch)
}
export async function deleteGoal(id: string) {
  await db.goals.delete(id)
}

// ---- Settings ----
export async function saveSettings(patch: Partial<Settings>) {
  const cur = (await db.settings.get('app')) ?? { id: 'app' as const, currency: 'USD', name: '' }
  await db.settings.put({ ...cur, ...patch, id: 'app' })
}
