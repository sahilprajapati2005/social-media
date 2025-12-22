import React from 'react';
import { AiOutlineWarning } from 'react-icons/ai';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like Sentry
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <div className="rounded-full bg-red-100 p-4">
            <AiOutlineWarning className="text-4xl text-red-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">Something went wrong.</h1>
          <p className="mt-2 max-w-md text-gray-600">
            We're sorry, but an unexpected error occurred. Please try refreshing the page.
          </p>
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 transition"
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Go Home
            </button>
          </div>

          {/* Optional: Show error details in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 w-full max-w-2xl overflow-auto rounded bg-gray-800 p-4 text-left text-xs text-red-200">
              {this.state.error && this.state.error.toString()}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;