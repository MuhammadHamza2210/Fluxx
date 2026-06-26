import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { useSettings } from '../hooks/useData'
import { useApp } from '../state/AppContext'
import { categoryColor, type Transaction } from '../types'
import { formatMoney } from '../lib/format'

export default function TransactionList({ items }: { items: Transaction[] }) {
  const { currency } = useSettings()
  const { openEdit } = useApp()

  if (items.length === 0) {
    return (
      <div className="grid place-items-center py-12 text-center text-sm text-[var(--muted)]">
        No transactions to show.
      </div>
    )
  }

  return (
    <ul className="divide-y divide-white/[0.05]">
      <AnimatePresence initial={false}>
        {items.map((t) => {
          const income = t.type === 'income'
          return (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => openEdit(t)}
                className="flex w-full items-center gap-3 px-1 py-3 text-left transition-colors hover:bg-white/[0.03]"
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold"
                  style={{ background: `${categoryColor(t.category)}22`, color: categoryColor(t.category) }}
                >
                  {t.category.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.note || t.category}</div>
                  <div className="text-xs text-[var(--muted)]">
                    {t.category}
                    {t.account ? ` · ${t.account}` : ''} · {format(parseISO(t.date), 'd MMM')}
                  </div>
                </div>
                <span className={`shrink-0 text-sm font-semibold ${income ? 'text-emerald-300' : 'text-[var(--fg)]'}`}>
                  {income ? '+' : '−'}
                  {formatMoney(t.amount, currency)}
                </span>
              </button>
            </motion.li>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}
