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

import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import useRouteHistory from './useRouteHistory';

export function parentRoute() {
  const potentialParent = window.location.hash
    .split('/')
    .slice(0, -1)
    .join('/');
  if (potentialParent.startsWith('#')) {
    return potentialParent;
  } else {
    return '#/';
  }
}

export function resolveRoute(route) {
  if (
    route.toLowerCase().startsWith('http://') ||
    route.toLowerCase().startsWith('https://')
  ) {
    /**
     * If the url starts with a protocol assume it's a full path and
     * visit it normally.
     */
    return route;
  } else if (route.startsWith('/')) {
    /**
     * If the url starts with a backslash visit it as a root view
     * within the context of the dashboard app.
     */
    return `#${route}`;
  } else if (route === '') {
    /**
     * If the url is empty visit it as a root view
     * within the context of the dashboard app.
     */
    return '#/';
  } else {
    /**
     * If the url has no root append it to the current route and create
     * a nested root within the context of the dashboard app.
     */
    return `${globalThis.location?.hash}/${route}`;
  }
}

export function matchPath({
  currentPath,
  path,
  availableRoutes,
  defaultRoute,
  isDefault = false,
  exact = false,
}) {
  const match = new RegExp(`^${path}`).exec(currentPath);

  // allow paths through that don't match if they are default, not narrowed out yet.
  if (!match && !isDefault) {
    return null;
  }

  // Find all available url matches
  const matchUrl = match?.[0];

  // Check if there is a default before looking for more exact matches
  // If there is and the current path fits 1 or less
  // of the available routes then render it as default
  if (isDefault) {
    const isValidDefaultRoute =
      availableRoutes.filter((route) => currentPath.startsWith(route)).length <=
      1;

    if (isValidDefaultRoute) {
      return defaultRoute;
    }
  }

  const isExactMatch = currentPath === matchUrl;
  if (exact && !isExactMatch) {
    return null;
  }
  return matchUrl;
}

function Route({ component, path, exact = false, isDefault = false }) {
  const { availableRoutes, currentPath, defaultRoute } = useRouteHistory(
    ({ state }) => state
  );

  const match = matchPath({
    currentPath,
    availableRoutes,
    defaultRoute,
    path,
    exact,
    isDefault,
  });

  if (!match) {
    return null;
  }
  return component;
}

Route.propTypes = {
  component: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  isDefault: PropTypes.bool,
};

export default Route;
