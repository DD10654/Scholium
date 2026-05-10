import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Uncaught render error:', error, info.componentStack);
    }

    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>
                    <h2>Something went wrong</h2>
                    <p>Please refresh the page. If the problem persists, contact support.</p>
                    <button onClick={() => this.setState({ error: null })}>Try again</button>
                </div>
            );
        }
        return this.props.children;
    }
}
