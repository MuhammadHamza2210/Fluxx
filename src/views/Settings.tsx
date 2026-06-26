import { useRef, useState } from 'react'
import { Download, Upload, Database, Trash2, FileSpreadsheet } from 'lucide-react'
import { db, clearAllData } from '../db'
import { useTransactions, useSettings } from '../hooks/useData'
import { saveSettings, importTransactions } from '../lib/actions'
import { transactionsToCSV, csvToTransactions, download } from '../lib/csv'
import { CURRENCIES } from '../types'

export default function Settings() {
  const txns = useTransactions() ?? []
  const settings = useSettings()
  const csvInput = useRef<HTMLInputElement>(null)
  const jsonInput = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 4000)
  }

  const exportCSV = () => {
    download('fluxx-transactions.csv', transactionsToCSV(txns), 'text/csv')
    flash('Exported transactions to CSV.')
  }

  const onImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const res = csvToTransactions(text)
    if (res.imported) await importTransactions(res.transactions)
    flash(`Imported ${res.imported} transaction(s)${res.skipped ? `, skipped ${res.skipped}` : ''}.`)
    e.target.value = ''
  }

  const exportBackup = async () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      transactions: await db.transactions.toArray(),
      budgets: await db.budgets.toArray(),
      goals: await db.goals.toArray(),
      accounts: await db.accounts.toArray(),
      settings: await db.settings.toArray(),
    }
    download('fluxx-backup.json', JSON.stringify(data, null, 2), 'application/json')
    flash('Full backup downloaded.')
  }

  const onImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      await clearAllData()
      await db.settings.clear()
      if (data.transactions) await db.transactions.bulkPut(data.transactions)
      if (data.budgets) await db.budgets.bulkPut(data.budgets)
      if (data.goals) await db.goals.bulkPut(data.goals)
      if (data.accounts) await db.accounts.bulkPut(data.accounts)
      if (data.settings) await db.settings.bulkPut(data.settings)
      flash('Backup restored.')
    } catch {
      flash('Could not read that backup file.')
    }
    e.target.value = ''
  }

  const doClear = async () => {
    await clearAllData()
    setConfirmClear(false)
    flash('All financial data cleared.')
  }

  return (
    <div className="max-w-2xl space-y-4 pb-10">
      {msg && (
        <div className="card border-accent/30 bg-accent/[0.08] px-4 py-3 text-sm text-accent-glow">{msg}</div>
      )}

      {/* Preferences */}
      <div className="card p-6">
        <h3 className="font-display text-base font-semibold">Preferences</h3>
        <p className="mb-5 text-xs text-[var(--muted)]">Personalize how Fluxx looks.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-[var(--muted)]">Your name</label>
            <input
              defaultValue={settings.name}
              onBlur={(e) => saveSettings({ name: e.target.value })}
              placeholder="Optional"
              className="input"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[var(--muted)]">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => saveSettings({ currency: e.target.value })}
              className="input"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c} className="bg-ink-800">
                  {c} ({CURRENCIES[c].symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('fluxx.welcomed')
            window.location.reload()
          }}
          className="btn btn-ghost mt-4"
        >
          Show welcome guide again
        </button>
      </div>

      {/* Data */}
      <div className="card p-6">
        <h3 className="font-display text-base font-semibold">Your data</h3>
        <p className="mb-5 text-xs text-[var(--muted)]">
          Everything is stored locally in this browser. Export it anytime — nothing is ever uploaded.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={exportCSV} className="btn btn-ghost justify-start">
            <FileSpreadsheet size={16} /> Export CSV
          </button>
          <button onClick={() => csvInput.current?.click()} className="btn btn-ghost justify-start">
            <Upload size={16} /> Import CSV
          </button>
          <button onClick={exportBackup} className="btn btn-ghost justify-start">
            <Download size={16} /> Download backup
          </button>
          <button onClick={() => jsonInput.current?.click()} className="btn btn-ghost justify-start">
            <Database size={16} /> Restore backup
          </button>
        </div>
        <input ref={csvInput} type="file" accept=".csv,text/csv" hidden onChange={onImportCSV} />
        <input ref={jsonInput} type="file" accept="application/json,.json" hidden onChange={onImportBackup} />
      </div>

      {/* Danger */}
      <div className="card border-rose-500/20 p-6">
        <h3 className="font-display text-base font-semibold text-rose-300">Danger zone</h3>
        <p className="mb-5 text-xs text-[var(--muted)]">Permanently delete all transactions, budgets and goals.</p>
        {confirmClear ? (
          <div className="flex items-center gap-3">
            <span className="text-sm">Are you sure? This can’t be undone.</span>
            <button onClick={doClear} className="btn bg-rose-500 text-white hover:bg-rose-600">
              Yes, delete everything
            </button>
            <button onClick={() => setConfirmClear(false)} className="btn btn-ghost">
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            className="btn btn-ghost text-rose-300 hover:bg-rose-500/10"
          >
            <Trash2 size={16} /> Clear all data
          </button>
        )}
      </div>

      <p className="px-1 text-center text-xs text-[var(--muted)]">
        Fluxx · private offline finance dashboard · built by Muhammad Hamza
      </p>
    </div>
  )
}
