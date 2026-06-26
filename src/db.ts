import Dexie, { type Table } from 'dexie'
import type { Transaction, Budget, Goal, Account, Settings } from './types'

/**
 * Fluxx local database. Everything lives in the browser's IndexedDB —
 * no server, no API, nothing leaves the device.
 */
export class FluxxDB extends Dexie {
  transactions!: Table<Transaction, string>
  budgets!: Table<Budget, string>
  goals!: Table<Goal, string>
  accounts!: Table<Account, string>
  settings!: Table<Settings, string>

  constructor() {
    super('fluxx')
    this.version(1).stores({
      transactions: 'id, date, category, type',
      budgets: 'id, category',
      goals: 'id',
      accounts: 'id',
      settings: 'id',
    })
  }
}

export const db = new FluxxDB()

export async function getSettings(): Promise<Settings> {
  const s = await db.settings.get('app')
  return s ?? { id: 'app', currency: 'USD', name: '' }
}

export async function clearAllData() {
  await Promise.all([
    db.transactions.clear(),
    db.budgets.clear(),
    db.goals.clear(),
    db.accounts.clear(),
  ])
}
