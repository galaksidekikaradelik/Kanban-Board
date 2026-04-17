import { Component } from "react";


export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? "Naməlum xəta" };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary] Xəta tutuldu:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-boundary">
          <p className="error-boundary__title">Bir xəta baş verdi</p>
          <p className="error-boundary__msg">{this.state.message}</p>
          <button className="error-boundary__btn" onClick={this.handleReset}>
            Yenidən cəhd et
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}