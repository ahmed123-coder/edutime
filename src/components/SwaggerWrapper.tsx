"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Filter out React warnings we want to suppress
    if (
      error.message?.includes('UNSAFE_componentWillReceiveProps') &&
      error.message?.includes('ModelCollapse')
    ) {
      return { hasError: false }; // Don't treat as error
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Filter out React warnings we want to suppress
    if (
      error.message?.includes('UNSAFE_componentWillReceiveProps') &&
      error.message?.includes('ModelCollapse')
    ) {
      return; // Don't treat as error
    }

    console.error("SwaggerUI Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Swagger UI Error
            </h2>
            <p className="text-gray-600 mb-4">
              There was an error loading the API documentation.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Warning suppression component
function WarningSuppressor({ children }: { children: ReactNode }) {
  React.useEffect(() => {
    // Override console methods
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    console.warn = (...args: any[]) => {
      const message = String(args[0] || '');
      if (
        message.includes('UNSAFE_componentWillReceiveProps') ||
        message.includes('ModelCollapse') ||
        message.includes('componentWillReceiveProps') ||
        message.includes('strict mode')
      ) {
        return; // Suppress these warnings
      }
      originalConsoleWarn(...args);
    };

    console.error = (...args: any[]) => {
      const message = String(args[0] || '');
      if (
        message.includes('UNSAFE_componentWillReceiveProps') ||
        message.includes('ModelCollapse') ||
        message.includes('componentWillReceiveProps') ||
        message.includes('strict mode') ||
        message.includes('CLIENT_FETCH_ERROR') ||
        message.includes('next-auth') ||
        (message.includes('JSON.parse') && message.includes('unexpected character'))
      ) {
        return; // Suppress these warnings and NextAuth errors
      }
      originalConsoleError(...args);
    };

    return () => {
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
    };
  }, []);

  return <>{children}</>;
}

export function SwaggerWrapper({ children }: { children: ReactNode }) {
  return (
    <WarningSuppressor>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </WarningSuppressor>
  );
}