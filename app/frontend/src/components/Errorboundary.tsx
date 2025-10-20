import React from "react";

interface ErrorBoundaryProps {
  fallback: React.ReactNode | ((message: string) => React.ReactNode);
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasErr: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasErr: false, message: "" };
  }

  static getDerivedStateFromError(err: any) {
    return { hasErr: true, message: err.message ?? "" };
  }

  render() {
    const { fallback } = this.props;

    if (!this.state.hasErr) {
      return this.props.children;
    }

    if (typeof fallback === "function") {
      return fallback(this.state.message);
    }

    return fallback;
  }
}
