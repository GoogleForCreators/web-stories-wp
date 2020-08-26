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
import { parse, stringify } from 'query-string';
import { createHashHistory } from 'history';

/**
 * Internal dependencies
 */
import { trackScreenView } from '../../../tracking';
import { createContext } from '../../utils';

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

  useEffect(() => {
    const query = stringify(queryParams);
    trackScreenView(currentPath + (query ? `?${query}` : ''));
  }, [currentPath, queryParams]);

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
