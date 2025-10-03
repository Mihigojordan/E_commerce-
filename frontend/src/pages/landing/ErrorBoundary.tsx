import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
          <div className="max-w-3xl w-full">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-green-600 p-8 text-white">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                    <AlertTriangle className="w-16 h-16" />
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
                  Oops! Something Went Wrong
                </h1>
                <p className="text-center text-teal-100 text-lg">
                  Your sparkle got dimmed for a moment
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="mb-8">
                  <p className="text-gray-700 text-lg mb-4 text-center">
                    Don't worry, our team has been notified and we're working to restore the shine.
                  </p>
                  <p className="text-gray-600 text-center">
                    In the meantime, you can try refreshing the page or returning to discover more jewelry.
                  </p>
                </div>

                {/* Error Details (Development Mode) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mb-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                      Technical Details (Dev Mode)
                    </summary>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Error Message:</p>
                        <pre className="bg-teal-50 border border-teal-200 p-3 rounded text-xs text-teal-800 overflow-x-auto">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Stack Trace:</p>
                          <pre className="bg-gray-100 border border-gray-300 p-3 rounded text-xs text-gray-700 overflow-x-auto max-h-64 overflow-y-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={this.handleReload}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Refresh Page
                  </button>
                  <button
                    onClick={this.handleGoHome}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                  >
                    <Home className="w-5 h-5" />
                    Back to Home
                  </button>
                </div>

                {/* Help Section */}
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 text-center">
                  <Mail className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    If this problem persists, please contact our customer support team.
                  </p>
                  <a
                    href="mailto:support@novagems.rw"
                    className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    support@novagems.rw
                  </a>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Error ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;