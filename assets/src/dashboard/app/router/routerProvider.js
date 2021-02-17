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
import { useRef, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import { createHashHistory } from 'history';

/**
 * Internal dependencies
 */
import { createContext } from '../../../design-system';

export const RouterContext = createContext({ state: {}, actions: {} });

function RouterProvider({ children, ...props }) {
  const history = useRef(props.history || createHashHistory());
  const [currentPath, setCurrentPath] = useState(
    history.current.location.pathname
  );
  const [queryParams, setQueryParams] = useState(
    parse(history.current.location.search)
  );

  useEffect(() => {
    return history.current.listen(({ location }) => {
      setQueryParams(parse(location.search));
      setCurrentPath(location.pathname);
    });
  }, []);

  // Sync up WP navigation bar with our hash location.
  useEffect(() => {
    let query = `a[href$="#${currentPath}"]`;
    // `My Stories` link in WP doesn't have a hash in the href
    if (currentPath.length <= 1) {
      query = 'a[href$="page=stories-dashboard"]';
    }

    const WPSubmenuItems = document.querySelectorAll(
      '#menu-posts-web-story ul.wp-submenu li'
    );
    WPSubmenuItems?.forEach((el) => {
      el.classList.remove('current');
      el.querySelector('a')?.classList.remove('current');
      el.querySelector('a')?.removeAttribute('aria-current');
    });
    WPSubmenuItems?.forEach((el) => {
      if (el.querySelector(query)) {
        el.classList.add('current');
        el.querySelector('a')?.classList.add('current');
        el.querySelector('a')?.setAttribute('aria-current', 'page');
      }
    });
  }, [currentPath]);

  const value = useMemo(
    () => ({
      state: {
        currentPath,
        queryParams,
      },
      actions: {
        push: history.current.push,
        replace: history.current.replace,
      },
    }),
    [currentPath, queryParams]
  );

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

RouterProvider.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object,
};

export default RouterProvider;
