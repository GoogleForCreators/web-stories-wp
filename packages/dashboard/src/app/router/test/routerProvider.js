/*
 * Copyright 2022 Google LLC
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
import { renderHook, act } from '@testing-library/react-hooks';
/**
 * Internal dependencies
 */
import RouterProvider, { getActiveRoute } from '../routerProvider';
import useRouteHistory from '../useRouteHistory';

const DEFAULT_ROUTE = '/';
const ROUTE_LIST = ['/templates-gallery', '/settings', '/custom-route'];
const AVAILABLE_ROUTES = [...ROUTE_LIST, DEFAULT_ROUTE];

describe('routerProvider', () => {
  it('should set available and default routes', async () => {
    const { result } = renderHook(() => useRouteHistory(), {
      wrapper: (props) => <RouterProvider {...props} />,
    });

    await act(async () => {
      await result.current.actions.setAvailableRoutes(AVAILABLE_ROUTES);
      await result.current.actions.setDefaultRoute(DEFAULT_ROUTE);
    });

    expect(result.current.state.availableRoutes).toStrictEqual(
      AVAILABLE_ROUTES
    );
    expect(result.current.state.defaultRoute).toStrictEqual(DEFAULT_ROUTE);
    expect(result.current.state.activeRoute).toStrictEqual(DEFAULT_ROUTE);
  });

  it.each`
    currentPath             | result
    ${'/'}                  | ${'/'}
    ${'/templates-gallery'} | ${'/templates-gallery'}
    ${'wpbody-content'}     | ${'/'}
    ${'/jafklajdfslkjl'}    | ${'/'}
  `(
    'should return proper active route if available otherwise the default route',
    ({ currentPath, result }) => {
      expect(
        getActiveRoute({
          currentPath,
          defaultRoute: DEFAULT_ROUTE,
          availableRoutes: AVAILABLE_ROUTES,
        })
      ).toStrictEqual(result);
    }
  );
});
