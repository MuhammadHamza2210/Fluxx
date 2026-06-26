import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'
import { useApp } from '../state/AppContext'
import { useAccounts } from '../hooks/useData'
import { addTransaction, updateTransaction, deleteTransaction } from '../lib/actions'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, type TxnType } from '../types'

export default function TransactionModal() {
  const { modalOpen, editing, closeModal } = useApp()
  const accounts = useAccounts() ?? []

  const [type, setType] = useState<TxnType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [account, setAccount] = useState('')
  const [note, setNote] = useState('')

  // hydrate form whenever the modal opens
  useEffect(() => {
    if (!modalOpen) return
    if (editing) {
      setType(editing.type)
      setAmount(String(editing.amount))
      setCategory(editing.category)
      setDate(editing.date)
      setAccount(editing.account ?? '')
      setNote(editing.note ?? '')
    } else {
      setType('expense')
      setAmount('')
      setCategory('Food')
      setDate(format(new Date(), 'yyyy-MM-dd'))
      setAccount('')
      setNote('')
    }
  }, [modalOpen, editing])

  // keep category valid when switching type
  useEffect(() => {
    const list = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
    if (!list.some((c) => c.name === category)) setCategory(list[0].name)
  }, [type]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeModal()
    if (modalOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, closeModal])

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = Math.abs(Number(amount))
    if (!Number.isFinite(amt) || amt <= 0) return
    const payload = { type, amount: amt, category, date, account: account || undefined, note: note || undefined }
    if (editing) await updateTransaction(editing.id, payload)
    else await addTransaction(payload)
    closeModal()
  }

  const remove = async () => {
    if (editing) {
      await deleteTransaction(editing.id)
      closeModal()
    }
  }

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-end sm:place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <motion.form
            onSubmit={submit}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="card relative z-10 w-full max-w-md p-6 sm:rounded-3xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                {editing ? 'Edit transaction' : 'Add transaction'}
              </h2>
              <button type="button" onClick={closeModal} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/10 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* type toggle */}
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-white/[0.04] p-1 ring-1 ring-white/[0.07]">
              {(['expense', 'income'] as TxnType[]).map((t) => {
                const active = type === t
                const Icon = t === 'expense' ? ArrowUpRight : ArrowDownLeft
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
                      active
                        ? t === 'expense'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                        : 'text-[var(--muted)] hover:text-white'
                    }`}
                  >
                    <Icon size={15} /> {t}
                  </button>
                )
              })}
            </div>

            <label className="mb-1.5 block text-sm text-[var(--muted)]">Amount</label>
            <input
              autoFocus
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input mb-4 text-lg font-semibold"
            />

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm text-[var(--muted)]">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                  {categories.map((c) => (
                    <option key={c.name} value={c.name} className="bg-ink-800">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--muted)]">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm text-[var(--muted)]">Account</label>
                <select value={account} onChange={(e) => setAccount(e.target.value)} className="input">
                  <option value="" className="bg-ink-800">—</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.name} className="bg-ink-800">
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--muted)]">Note</label>
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" className="input" />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button type="submit" className="btn btn-primary flex-1">
                {editing ? 'Save changes' : 'Add transaction'}
              </button>
              {editing && (
                <button type="button" onClick={remove} className="btn btn-ghost text-rose-300 hover:bg-rose-500/10" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
