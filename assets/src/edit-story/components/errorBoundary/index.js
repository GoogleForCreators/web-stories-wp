/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import ErrorActions from './errorActions';

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // eslint-disable-next-line no-unused-vars
  onError(evt) {
    // In the future we will take some action here
  }

  // eslint-disable-next-line no-unused-vars
  onUnhandledRejection(evt) {
    // In the future we might take some action here
  }

  componentDidMount() {
    window.addEventListener('error', this.onError);
    window.addEventListener('unhandledrejection', this.onUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.onError);
    window.removeEventListener('unhandledrejection', this.onError);
  }

  // eslint-disable-next-line no-unused-vars
  componentDidCatch(error, errorInfo) {
    // In the future we will take some action here
  }

  render() {
    if (this.state.hasError) {
      return <ErrorActions />;
    }
    return this.props.children;
  }
}

const shouldDisableErrorBoundaries =
  process.env.DISABLE_ERROR_BOUNDARIES === 'true';
export default shouldDisableErrorBoundaries
  ? ({ children }) => children
  : ErrorBoundary;
