import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI exception in component tree:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/workspace/operations/approvals';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#141417]/95 border border-rose-500/25 shadow-2xl backdrop-blur-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[1.8]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-white text-base font-semibold">Workspace View Encountered an Exception</h2>
              <p className="text-zinc-400 text-xs font-sans">
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </p>
            </div>

            {this.state.error?.stack && (
              <pre className="p-3 rounded-xl bg-black/60 border border-white/5 text-[10px] font-mono text-zinc-400 text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset View</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
