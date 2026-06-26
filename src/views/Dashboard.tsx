import { motion } from 'framer-motion'
import KpiCards from '../components/KpiCards'
import CashFlowChart from '../components/CashFlowChart'
import HealthScore from '../components/HealthScore'
import SpendingDonut from '../components/SpendingDonut'
import TrendChart from '../components/TrendChart'
import BudgetBars from '../components/BudgetBars'
import GoalsWidget from '../components/GoalsWidget'
import TransactionList from '../components/TransactionList'
import { useTransactions } from '../hooks/useData'
import { useApp } from '../state/AppContext'
import { inMonth } from '../lib/finance'

export default function Dashboard() {
  const txns = useTransactions() ?? []
  const { month } = useApp()
  const recent = [...inMonth(txns, month)]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
    .slice(0, 6)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 pb-10"
    >
      <KpiCards />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CashFlowChart />
        </div>
        <HealthScore />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SpendingDonut />
        <TrendChart />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BudgetBars compact />
        <GoalsWidget />
        <div className="card flex flex-col p-6">
          <h3 className="mb-4 font-display text-base font-semibold">Recent activity</h3>
          <TransactionList items={recent} />
        </div>
      </div>
    </motion.div>
  )
}
