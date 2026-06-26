import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import type { Settings } from '../types'

export const useTransactions = () =>
  useLiveQuery(() => db.transactions.toArray(), [], [])

export const useBudgets = () => useLiveQuery(() => db.budgets.toArray(), [], [])

export const useGoals = () =>
  useLiveQuery(() => db.goals.orderBy('createdAt').toArray(), [], [])

export const useAccounts = () => useLiveQuery(() => db.accounts.toArray(), [], [])

export const useSettings = (): Settings =>
  useLiveQuery(() => db.settings.get('app'), [], undefined) ?? {
    id: 'app',
    currency: 'USD',
    name: '',
  }
