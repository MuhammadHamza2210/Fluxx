import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface State {
  error: Error | null
}

/** Keeps a single component failure from blanking the whole app. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error('Fluxx caught an error:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-screen place-items-center p-6">
          <div className="card max-w-md p-8 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-rose-500/15 text-rose-300">
              <AlertTriangle size={22} />
            </div>
            <h1 className="font-display text-lg font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {this.state.error.message || 'An unexpected error occurred.'}
            </p>
            <button onClick={() => window.location.reload()} className="btn btn-primary mx-auto mt-6">
              <RefreshCw size={16} /> Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
