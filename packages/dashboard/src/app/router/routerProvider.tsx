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
import { useRef, useMemo, useEffect, useState } from '@googleforcreators/react';
import { createHashHistory } from 'history';
import type { History } from 'history';
import type { PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import { APP_ROUTES } from '../../constants';
import Context from './context';

interface ActiveRouteProps {
  availableRoutes: string[];
  currentPath: string;
  defaultRoute: string;
}
export const getActiveRoute = ({
  availableRoutes,
  currentPath,
  defaultRoute,
}: ActiveRouteProps) => {
  const matchingRoutes = availableRoutes.filter((route) =>
    currentPath.startsWith(route)
  );
  // this assumes that we have a route that's just the root path (/)
  return matchingRoutes.length <= 1 ? defaultRoute : currentPath;
};

function RouterProvider({
  children,
  ...props
}: PropsWithChildren<{ history: History }>) {
  const history = useRef<History>(props.history || createHashHistory());
  const [currentPath, setCurrentPath] = useState(
    history.current.location.pathname
  );
  const [availableRoutes, setAvailableRoutes] = useState<string[]>([]);
  const defaultRoute = APP_ROUTES.DASHBOARD;

  const activeRoute = useMemo(
    () => getActiveRoute({ availableRoutes, currentPath, defaultRoute }),
    [availableRoutes, currentPath, defaultRoute]
  );

  const parse = (search: string) => {
    const params = new URLSearchParams(search);
    return Object.fromEntries(params);
  };

  const [queryParams, setQueryParams] = useState(
    parse(history.current.location.search)
  );

  useEffect(() => {
    return history.current.listen(({ location }) => {
      setQueryParams(parse(location.search));
      setCurrentPath(location.pathname);
    });
  }, []);

  const value = useMemo(
    () => ({
      state: {
        activeRoute,
        currentPath,
        queryParams,
        availableRoutes,
        defaultRoute,
      },
      actions: {
        push: (path: string) => history.current.push(path),
        replace: (path: string) => history.current.replace(path),
        setAvailableRoutes,
      },
    }),
    [activeRoute, availableRoutes, currentPath, defaultRoute, queryParams]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export default RouterProvider;
