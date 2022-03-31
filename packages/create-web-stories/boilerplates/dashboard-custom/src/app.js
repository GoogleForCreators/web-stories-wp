/**
 * External dependencies.
 */
import React from "react";
import { hot } from "react-hot-loader";

/**
 * Internal dependencies.
 */
import StoryDashboard from "./dashboard";

class App extends React.Component {
  render() {
    return <StoryDashboard />;
  }
}

export default hot(module)(App);
