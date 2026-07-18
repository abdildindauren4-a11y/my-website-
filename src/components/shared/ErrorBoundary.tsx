// filepath: src/components/shared/ErrorBoundary.tsx
// Қате ұстағыш — бір беттегі қате бүкіл қосымшаны құлатпайды.

import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Қосымша қатесі:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-background">
          <div className="w-16 h-16 rounded-card bg-accent-red/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-accent-red" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Бірдеңе дұрыс болмады</h2>
          <p className="text-text-secondary mb-1">Something went wrong</p>
          <p className="text-sm text-text-muted mb-6">Бетті жаңартып көріңіз / Try reloading the page</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-accent-green text-white font-semibold text-sm px-5 py-2.5 rounded-btn shadow-soft hover:shadow-lg active:scale-[0.98] transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Қайта жүктеу / Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
