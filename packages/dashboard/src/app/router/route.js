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

export function resolveRelatedTemplateRoute(relatedTemplate) {
  return (
    window.location.hash.split('#')[1].split('?')[0] +
    '?' +
    relatedTemplate.centerTargetAction.split('?')[1]
  );
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
    return `${window.location.hash}/${route}`;
  }
}

export function matchPath(currentPath, path, exact = false) {
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
  const { state } = useRouteHistory();
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
