import { createContext, useContext, useState, type ReactNode } from 'react'
import { currentMonthKey } from '../lib/finance'
import type { Transaction } from '../types'

type View = 'dashboard' | 'transactions' | 'budgets' | 'goals' | 'settings'

interface AppState {
  view: View
  setView: (v: View) => void
  month: string
  setMonth: (m: string) => void
  // transaction add/edit modal
  modalOpen: boolean
  editing: Transaction | null
  openAdd: () => void
  openEdit: (t: Transaction) => void
  closeModal: () => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('dashboard')
  const [month, setMonth] = useState<string>(currentMonthKey())
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)

  const openAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (t: Transaction) => {
    setEditing(t)
    setModalOpen(true)
  }
  const closeModal = () => setModalOpen(false)

  return (
    <Ctx.Provider
      value={{ view, setView, month, setMonth, modalOpen, editing, openAdd, openEdit, closeModal }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export type { View }
