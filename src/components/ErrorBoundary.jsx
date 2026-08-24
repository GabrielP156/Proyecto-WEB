import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Error atrapado por ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black text-gray-200 font-mono p-6">
          <div className="max-w-lg w-full border border-fuchsia-500/50 rounded-2xl bg-neutral-900/90 p-6 text-center">
            <h1 className="text-xl font-bold uppercase text-fuchsia-300 mb-2">Ocurrió un error</h1>
            <p className="text-sm text-gray-400 mb-4">{this.state.error.message}</p>
            <button
              onClick={() => this.setState({ error: null })}
              className="rounded-md px-5 py-2 uppercase tracking-wide text-sm bg-black/70 border border-cyan-500/50 text-cyan-300 hover:border-fuchsia-500/70 hover:text-fuchsia-300 cursor-pointer transition-all duration-300"
            >
              Volver a intentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
