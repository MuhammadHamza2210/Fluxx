import { CURRENCIES } from '../types'

export function formatMoney(amount: number, currency = 'USD', compact = false): string {
  const meta = CURRENCIES[currency] ?? CURRENCIES.USD
  const fraction = currency === 'JPY' ? 0 : 2
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: compact && Math.abs(amount) >= 10000 ? 0 : fraction,
      minimumFractionDigits: compact && Math.abs(amount) >= 10000 ? 0 : fraction,
    }).format(amount)
  } catch {
    return `${meta.symbol}${amount.toFixed(fraction)}`
  }
}

export const currencySymbol = (currency: string) =>
  (CURRENCIES[currency] ?? CURRENCIES.USD).symbol

export const signed = (amount: number, type: 'income' | 'expense') =>
  type === 'income' ? amount : -amount
