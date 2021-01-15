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
import React, { useCallback, useState } from 'react';
import { render, fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import PropTypes from 'prop-types';
import { createContext, useContextSelector } from '../../../design-system';

describe('useContextSelector', () => {
  let context;

  beforeEach(() => (context = createContext(null)));

  const StateProvider = ({ children }) => {
    const [state, setState] = useState({ count: 0, ignore: 0 });
    const value = { ...state, setState };
    return <context.Provider value={value}>{children}</context.Provider>;
  };

  StateProvider.propTypes = {
    children: PropTypes.node,
  };

  it('counter', () => {
    let renderCount = 0;

    const Counter = () => {
      renderCount++;

      const { count, setState } = useContextSelector(context, (state) => ({
        count: state.count,
        setState: state.setState,
      }));
      const incIgnore = useCallback(
        () => setState((s) => ({ ...s, ignore: s.ignore + 1 })),
        [setState]
      );
      const incCount = useCallback(
        () => setState((s) => ({ ...s, count: s.count + 1 })),
        [setState]
      );

      return (
        <div>
          <span>{count}</span>
          <button onClick={incIgnore} data-testid="ignore++">
            {'ignore++'}
          </button>
          <button onClick={incCount} data-testid="count++">
            {'count++'}
          </button>
        </div>
      );
    };

    const { getByTestId } = render(
      <StateProvider>
        <Counter />
      </StateProvider>
    );
    expect(renderCount).toBe(1);

    fireEvent.click(getByTestId('ignore++'));
    expect(renderCount).toBe(1);

    fireEvent.click(getByTestId('count++'));
    expect(renderCount).toBe(2);
  });
});
