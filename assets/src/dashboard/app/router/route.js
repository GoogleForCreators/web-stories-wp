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

import { useContext } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { RouterContext } from './routerProvider';

function matchPath(currentPath, path, exact = false) {
  const match = new RegExp(`^${path}`).exec(currentPath);
  if (!match) {
    return null;
  }
  const matchUrl = match[0];
  const isExactMatch = currentPath === matchUrl;
  if (exact && !isExactMatch) {
    return null;
  }
  return matchUrl;
}

function Route({ component, path, exact }) {
  const { state } = useContext(RouterContext);
  const match = matchPath(state.currentPath, path, exact);
  if (!match) {
    return null;
  }
  return component;
}

Route.propTypes = {
  component: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
};

export default Route;
