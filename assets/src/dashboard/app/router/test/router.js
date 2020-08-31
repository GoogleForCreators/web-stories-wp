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
import { render, fireEvent } from '@testing-library/react';
import { createBrowserHistory } from 'history';

/**
 * Internal dependencies
 */
import { RouterProvider, Route, useRouteHistory } from '../index';

describe('RouterProvider', () => {
  it('should render the first route by default', () => {
    const { queryByText } = render(
      <RouterProvider>
        <Route path="/" exact component={<div>{'Home'}</div>} />
        <Route path="/second-route" component={<div>{'Second Route'}</div>} />
      </RouterProvider>
    );

    expect(queryByText('Home')).toBeInTheDocument();
    expect(queryByText('Second Route')).not.toBeInTheDocument();
  });

  it('should render the second route when navigated to', async () => {
    const history = createBrowserHistory();
    const listeners = [];

    jest.spyOn(history, 'listen').mockImplementation((callback) => {
      listeners.push(callback);
      return () => {};
    });

    jest.spyOn(history, 'push').mockImplementation((sender) => {
      listeners.forEach((l) => {
        l({ location: { search: '', pathname: sender } });
      });
    });

    const Button = () => {
      const { actions } = useRouteHistory();
      return (
        <button onClick={() => actions.push('/second-route')}>
          {'Visit Second Page'}
        </button>
      );
    };

    const { queryByText, findByText } = render(
      <RouterProvider history={history}>
        <Button />
        <Route path="/" exact component={<div>{'Home'}</div>} />
        <Route path="/second-route" component={<div>{'Second Route'}</div>} />
      </RouterProvider>
    );

    const link = await findByText('Visit Second Page');
    fireEvent.click(link);
    expect(queryByText('Home')).not.toBeInTheDocument();
    expect(queryByText('Second Route')).toBeInTheDocument();
  });

  it('should render the parent and sub-route when navigated to', async () => {
    const history = createBrowserHistory();
    const listeners = [];

    jest.spyOn(history, 'listen').mockImplementation((callback) => {
      listeners.push(callback);
      return () => {};
    });

    jest.spyOn(history, 'push').mockImplementation((sender) => {
      listeners.forEach((l) => {
        l({ location: { search: '', pathname: sender } });
      });
    });

    const Button = () => {
      const { actions } = useRouteHistory();
      return (
        <button onClick={() => actions.push('/second-route/sub-entity')}>
          {'Visit Sub Entity on Second Page'}
        </button>
      );
    };

    const { queryByText, findByText } = render(
      <RouterProvider history={history}>
        <Button />
        <Route path="/" exact component={<div>{'Home'}</div>} />
        <Route
          path="/second-route"
          component={
            <div>
              {'Second Route'}
              <Route
                path="/second-route/sub-entity"
                component={<div>{'Sub Entity Route'}</div>}
              />
            </div>
          }
        />
      </RouterProvider>
    );

    const link = await findByText('Visit Sub Entity on Second Page');
    fireEvent.click(link);
    expect(queryByText('Home')).not.toBeInTheDocument();
    expect(queryByText('Second Route')).toBeInTheDocument();
    expect(queryByText('Sub Entity Route')).toBeInTheDocument();
  });
});
