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
import RouterProvider from '../routerProvider';
import useRouteHistory from '../useRouteHistory';

const DEFAULT_ROUTE = '/';
const ROUTE_LIST = ['/templates-gallery', '/settings', '/custom-route'];

describe('routerProvider', () => {
  let result = null;

  beforeEach(async () => {
    const { result: _result } = renderHook(() => useRouteHistory(), {
      wrapper: (props) => <RouterProvider {...props} />,
    });

    await act(async () => {
      await _result.current.actions.setAvailableRoutes([
        ...ROUTE_LIST,
        DEFAULT_ROUTE,
      ]);
      await _result.current.actions.setDefaultRoute(DEFAULT_ROUTE);
    });
    result = _result;
  });

  it('should set available and default routes', () => {
    expect(result.current.state.availableRoutes).toStrictEqual([
      ...ROUTE_LIST,
      DEFAULT_ROUTE,
    ]);
    expect(result.current.state.defaultRoute).toStrictEqual(DEFAULT_ROUTE);
    expect(result.current.state.activeRoute).toStrictEqual(DEFAULT_ROUTE);
  });

  it('should keep activeRoute in sync even when route is not in our list of availableRoutes', async () => {
    expect(result.current.state.activeRoute).toStrictEqual(DEFAULT_ROUTE);

    await act(async () => {
      await result.current.actions.push(ROUTE_LIST[0]);
    });
    expect(result.current.state.activeRoute).toStrictEqual(ROUTE_LIST[0]);

    await act(async () => {
      await result.current.actions.push('wpbody-content');
    });
    expect(result.current.state.activeRoute).toStrictEqual(DEFAULT_ROUTE);

    await act(async () => {
      await result.current.actions.push(`${ROUTE_LIST[0]}?id=51&isLocal=false`);
    });
    expect(result.current.state.activeRoute).toStrictEqual(ROUTE_LIST[0]);
  });
});
