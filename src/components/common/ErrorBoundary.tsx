import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Global React Error Boundary.
 * Catches unhandled runtime errors in the component tree and renders
 * a friendly recovery UI instead of a blank white screen.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console for development visibility
    console.error('[CampusHub ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6"
        >
          <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-danger"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>

          <div className="space-y-2 max-w-md">
            <h1 className="text-2xl font-extrabold text-foreground">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred. Please try returning to the home page.
            </p>
            {import.meta.env.DEV && this.state.errorMessage && (
              <pre className="mt-3 p-3 rounded-lg bg-muted text-left text-[11px] text-danger overflow-auto max-h-32">
                {this.state.errorMessage}
              </pre>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              id="error-boundary-go-home"
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Go to Home
            </button>
            <button
              id="error-boundary-reload"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-bold hover:bg-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
