# Fluxx — Personal Finance Dashboard

> A private, **offline-first** money dashboard. Track income & expenses, set
> budgets and savings goals, and see where your money goes — all in beautiful
> charts. **No accounts, no servers, no APIs.** Your data never leaves your device.

Built with **React + TypeScript + Vite**, **Tailwind CSS**, **Framer Motion**,
**Recharts**, and **Dexie (IndexedDB)**.

## Features

- 📊 **Dashboard** — KPI cards (net, income, expenses, savings rate) with animated
  counters and month-over-month deltas
- 🍩 **Spending by category** donut + **cash-flow** area chart + 6-month
  **income vs expenses** trend
- ❤️ **Financial health score** — an explainable 0–100 read on savings rate,
  budget adherence and spending trend
- 💸 **Transactions** — add / edit / delete, search & filter, per-month view
- 🎯 **Budgets** with live progress bars and overspend warnings
- 🏦 **Savings goals** with progress rings and quick "add funds"
- 🗓️ **Month switcher** to browse any month
- 💾 **Your data, your control** — CSV import/export, full JSON backup & restore,
  multi-currency, stored entirely in your browser (IndexedDB)
- 🎨 Premium dark glass UI, fully responsive, reduced-motion aware

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the build
```

On first run, Fluxx seeds a few months of realistic demo data so the dashboard
isn't empty. Clear it anytime from **Settings → Danger zone**.

## How it works

Everything is client-side. Transactions, budgets, goals and settings live in
**IndexedDB** via Dexie, and the UI updates reactively through `useLiveQuery`.
There is no backend and no network request — open it on a plane and it works.

## Privacy

Fluxx never sends your financial data anywhere. It stays in your browser on your
device. Export a backup whenever you want full ownership of your data.

---

Built by **Muhammad Hamza**.
