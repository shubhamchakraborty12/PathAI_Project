import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PathAI UI Render Error Caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    window.location.reload();
  };

  handleSoftReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-zinc-900/90 border border-purple-500/30 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                An unexpected rendering error occurred. You can reload the workspace or reset session cache below.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-left font-mono text-xs text-red-300 max-h-32 overflow-y-auto break-all">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleSoftReload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold text-xs text-white transition-all shadow-lg"
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-semibold text-xs text-zinc-300 transition-all border border-zinc-700"
              >
                <Trash2 size={14} className="text-red-400" />
                <span>Clear Cache & Reset</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
