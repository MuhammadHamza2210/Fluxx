import { motion } from 'framer-motion'
import { LayoutDashboard, ArrowLeftRight, Wallet, Target, Settings, Lock, Activity } from 'lucide-react'
import { useApp, type View } from '../state/AppContext'

const NAV: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'budgets', label: 'Budgets', icon: Wallet },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { view, setView } = useApp()
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/[0.06] px-4 py-6 lg:flex">
      <div className="mb-9 flex items-center gap-2.5 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-cyan text-white shadow-[0_8px_24px_-6px_rgba(124,92,255,0.7)]">
          <Activity size={18} strokeWidth={2.5} />
        </div>
        <span className="font-display text-xl font-bold tracking-tight">
          Flu<span className="gradient-text">xx</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active = view === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active ? 'text-white' : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-xl bg-white/[0.07] ring-1 ring-white/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06]">
        <div className="flex items-center gap-2 text-xs font-semibold text-accent-glow">
          <Lock size={13} /> Private by design
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">
          100% offline. Your data is stored only on this device — no account, no servers.
        </p>
      </div>
    </aside>
  )
}
