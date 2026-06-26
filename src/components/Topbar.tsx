import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format, parseISO, addMonths, subMonths } from 'date-fns'
import { useApp, type View } from '../state/AppContext'
import { monthLabel, currentMonthKey } from '../lib/finance'
import { LayoutDashboard, ArrowLeftRight, Wallet, Target, Settings } from 'lucide-react'

const TITLES: Record<View, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your money at a glance' },
  transactions: { title: 'Transactions', subtitle: 'Every income & expense' },
  budgets: { title: 'Budgets', subtitle: 'Keep spending on track' },
  goals: { title: 'Savings Goals', subtitle: 'What you’re working toward' },
  settings: { title: 'Settings', subtitle: 'Data, currency & preferences' },
}

const MOBILE_NAV: { id: View; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'transactions', icon: ArrowLeftRight },
  { id: 'budgets', icon: Wallet },
  { id: 'goals', icon: Target },
  { id: 'settings', icon: Settings },
]

export default function Topbar() {
  const { view, setView, month, setMonth, openAdd } = useApp()
  const showMonth = view === 'dashboard' || view === 'transactions' || view === 'budgets'
  const isCurrent = month === currentMonthKey()

  const shift = (dir: -1 | 1) => {
    const d = parseISO(`${month}-01`)
    setMonth(format(dir === 1 ? addMonths(d, 1) : subMonths(d, 1), 'yyyy-MM'))
  }

  return (
    <header className="sticky top-0 z-30 -mx-5 mb-6 border-b border-white/[0.06] bg-[var(--bg)]/70 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            {TITLES[view].title}
          </h1>
          <p className="text-sm text-[var(--muted)]">{TITLES[view].subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {showMonth && (
            <div className="flex items-center gap-1 rounded-xl bg-white/[0.04] p-1 ring-1 ring-white/[0.07]">
              <button
                onClick={() => shift(-1)}
                className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="min-w-[120px] text-center text-sm font-medium">
                {monthLabel(month)}
              </span>
              <button
                onClick={() => shift(1)}
                disabled={isCurrent}
                className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <button onClick={openAdd} className="btn btn-primary">
            <Plus size={16} /> <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      {/* mobile nav */}
      <nav className="mt-4 flex gap-1.5 overflow-x-auto lg:hidden">
        {MOBILE_NAV.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm capitalize transition-colors ${
              view === id ? 'bg-white/10 text-white' : 'text-[var(--muted)]'
            }`}
          >
            <Icon size={15} /> {id}
          </button>
        ))}
      </nav>
    </header>
  )
}
