import { AnimatePresence, motion } from 'framer-motion'
import { Activity, PlusCircle, Wallet, PieChart, Lock } from 'lucide-react'

const STEPS = [
  { icon: PlusCircle, title: 'Add what you earn & spend', text: 'Tap “＋ Add” to log any income or expense in seconds.' },
  { icon: Wallet, title: 'Set budgets & goals', text: 'Give categories a monthly limit and save toward what you want.' },
  { icon: PieChart, title: 'See where it goes', text: 'Live charts and a health score keep you on track.' },
  { icon: Lock, title: '100% private', text: 'Everything stays on this device. No account, no servers.' },
]

export default function WelcomeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="card relative z-10 w-full max-w-lg overflow-hidden p-7 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-accent/40 to-accent-cyan/0 blur-3xl" />

            <div className="relative mb-6 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-cyan text-white shadow-[0_10px_30px_-8px_rgba(124,92,255,0.8)]">
                <Activity size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight">
                  Welcome to Flu<span className="gradient-text">xx</span>
                </h2>
                <p className="text-sm text-[var(--muted)]">Your private, offline money dashboard.</p>
              </div>
            </div>

            <ul className="relative grid gap-3 sm:grid-cols-2">
              {STEPS.map((s) => {
                const Icon = s.icon
                return (
                  <li key={s.title} className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06]">
                    <span className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent-glow">
                      <Icon size={16} />
                    </span>
                    <div className="text-sm font-semibold">{s.title}</div>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">{s.text}</p>
                  </li>
                )
              })}
            </ul>

            <p className="relative mt-5 text-center text-xs text-[var(--muted)]">
              We’ve added some sample data so you can explore. Clear it anytime in Settings.
            </p>

            <button onClick={onClose} className="btn btn-primary relative mt-5 w-full">
              Got it — let’s go
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
