import React from "react";
import ErrorBoundary from "react-error-boundary";

import "./App.css";

import FindPicture from "./findPicture/FindPicture";

class App extends React.Component<
  {},
  {
    errorBoundaryKey: number;
    hasError: boolean;
  }
> {
  state = {
    errorBoundaryKey: 0,
    hasError: false
  };

  handleResetButtonClick = () =>
    this.setState(prevState => ({
      errorBoundaryKey: prevState.errorBoundaryKey + 1,
      hasError: false
    }));

  render() {
    return !this.state.hasError ? (
      <ErrorBoundary
        key={this.state.errorBoundaryKey}
        onError={() => {
          localStorage.clear();
          this.setState({ hasError: true });
        }}
      >
        <FindPicture />
      </ErrorBoundary>
    ) : (
      <div style={{ display: "grid", height: "100%" }}>
        <button onClick={this.handleResetButtonClick}>
          reset error boundary
        </button>
      </div>
    );
  }
}

export default App;
