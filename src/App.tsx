import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import TransactionModal from './components/TransactionModal'
import WelcomeModal from './components/WelcomeModal'
import Dashboard from './views/Dashboard'
import Transactions from './views/Transactions'
import Budgets from './views/Budgets'
import Goals from './views/Goals'
import Settings from './views/Settings'
import { useApp } from './state/AppContext'
import { seedIfEmpty } from './lib/seed'

const VIEWS = {
  dashboard: Dashboard,
  transactions: Transactions,
  budgets: Budgets,
  goals: Goals,
  settings: Settings,
}

const WELCOME_KEY = 'fluxx.welcomed'

export default function App() {
  const { view } = useApp()
  const [ready, setReady] = useState(false)
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem(WELCOME_KEY))

  const dismissWelcome = () => {
    localStorage.setItem(WELCOME_KEY, '1')
    setShowWelcome(false)
  }

  useEffect(() => {
    // Ask the browser to keep our IndexedDB data durable so it isn't evicted
    // between sessions. Without this, some browsers treat storage as "best
    // effort" and may clear it — which looked like settings/data resetting.
    if (navigator.storage?.persist) {
      navigator.storage.persisted().then((persisted) => {
        if (!persisted) navigator.storage.persist()
      })
    }

    let done = false
    const finish = () => {
      if (!done) {
        done = true
        setReady(true)
      }
    }
    // Seed demo data on first run, but never block the UI on it —
    // live queries fill in reactively, and we reveal the app within 1.2s regardless.
    seedIfEmpty().finally(finish)
    const t = setTimeout(finish, 1200)
    return () => clearTimeout(t)
  }, [])

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="grid h-12 w-12 animate-pulse place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-cyan text-white">
            <Activity size={22} />
          </div>
          <span className="text-sm text-[var(--muted)]">Loading Fluxx…</span>
        </div>
      </div>
    )
  }

  const ActiveView = VIEWS[view]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 px-5 sm:px-8">
        <Topbar />
        <div className="mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActiveView />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <TransactionModal />
      <WelcomeModal open={ready && showWelcome} onClose={dismissWelcome} />
    </div>
  )
}
