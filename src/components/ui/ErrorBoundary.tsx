import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children:  ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          className="min-h-screen flex items-center justify-center px-6"
          style={{ background: '#f4f1ea' }}
        >
          <div className="text-center max-w-md">
            <h1
              className="text-2xl font-light mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: '#2c2c2c' }}
            >
              Algo salió mal
            </h1>
            <p className="text-sm font-light mb-6" style={{ color: '#6a6a6a' }}>
              Hubo un error inesperado. Intentá recargar la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-solid"
              style={{ marginTop: 0 }}
            >
              Recargar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
