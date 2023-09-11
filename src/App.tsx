import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { setup } from "twind";
import * as colors from "twind/colors";

import "./App.css";

import { Pages } from "./Pages";

setup({
  theme: {
    extend: {
      fontFamily: {
        serif:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      },
      colors,
    },
  },
});

class App extends React.Component<
  {},
  {
    errorBoundaryKey: number;
    hasError: boolean;
  }
> {
  state = {
    errorBoundaryKey: 0,
    hasError: false,
  };

  handleResetButtonClick = () =>
    this.setState((prevState) => ({
      errorBoundaryKey: prevState.errorBoundaryKey + 1,
      hasError: false,
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
        <Pages />
      </ErrorBoundary>
    ) : (
      <div style={{ display: "grid", height: "100%" }}>
        <button onClick={this.handleResetButtonClick}>reset error boundary</button>
      </div>
    );
  }
}

export default App;
