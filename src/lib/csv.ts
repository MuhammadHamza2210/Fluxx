import { v4 as uuid } from 'uuid'
import type { Transaction, TxnType } from '../types'

const HEADER = ['date', 'type', 'category', 'amount', 'note', 'account']

function escapeCell(v: string): string {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`
  return v
}

export function transactionsToCSV(txns: Transaction[]): string {
  const rows = [...txns]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((t) =>
      [t.date, t.type, t.category, String(t.amount), t.note ?? '', t.account ?? '']
        .map(escapeCell)
        .join(','),
    )
  return [HEADER.join(','), ...rows].join('\n')
}

/** Minimal CSV line parser that respects quotes. */
function parseLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (c === '"') {
        inQuotes = false
      } else {
        cur += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      out.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  out.push(cur)
  return out
}

export interface ParseResult {
  transactions: Transaction[]
  imported: number
  skipped: number
}

export function csvToTransactions(text: string): ParseResult {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) return { transactions: [], imported: 0, skipped: 0 }

  const header = parseLine(lines[0]).map((h) => h.trim().toLowerCase())
  const col = (name: string) => header.indexOf(name)
  const iDate = col('date')
  const iType = col('type')
  const iCat = col('category')
  const iAmt = col('amount')
  const iNote = col('note')
  const iAcc = col('account')

  const transactions: Transaction[] = []
  let skipped = 0

  for (let r = 1; r < lines.length; r++) {
    const cells = parseLine(lines[r])
    const dateRaw = (cells[iDate] ?? '').trim()
    const amount = Math.abs(Number((cells[iAmt] ?? '').trim()))
    if (!dateRaw || !Number.isFinite(amount) || amount === 0) {
      skipped++
      continue
    }
    const date = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw)
      ? dateRaw
      : new Date(dateRaw).toISOString().slice(0, 10)
    const typeRaw = (cells[iType] ?? 'expense').trim().toLowerCase()
    const type: TxnType = typeRaw === 'income' ? 'income' : 'expense'

    transactions.push({
      id: uuid(),
      type,
      amount,
      category: (cells[iCat] ?? 'Other').trim() || 'Other',
      note: (cells[iNote] ?? '').trim() || undefined,
      account: (cells[iAcc] ?? '').trim() || undefined,
      date,
      createdAt: Date.now() + r,
    })
  }

  return { transactions, imported: transactions.length, skipped }
}

export function download(filename: string, content: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
