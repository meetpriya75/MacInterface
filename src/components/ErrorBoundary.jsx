import { Component } from "react"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error("Window app crashed:", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="window-error">
          <h2>App failed to load</h2>
          <p>Close and reopen this window to try again.</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
