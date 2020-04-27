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
import { renderHook } from '@testing-library/react-hooks';
/**
 * Internal dependencies
 */
/**
 * Internal dependencies
 */
import LayoutProvider from '../provider';
import useLayoutContext from '../useLayoutContext';

describe('useLayoutContext()', () => {
  it('should throw an error if used oustide LayoutProvider', () => {
    expect(renderHook(() => useLayoutContext())).toThrow(Error);
  });

  it('should not throw an error if used inside LayoutProvider', () => {
    expect(
      renderHook({
        callback: () => useLayoutContext(),
        options: {
          wrapper: LayoutProvider,
        },
      })
    ).not.toThrow(Error);
  });

  it.todo('has a setable squish height');

  it.todo('is subscribable to squish events', () => {
    const { result } = renderHook({
      callback: () => useLayoutContext(),
      options: {
        wrapper: LayoutProvider,
      },
    });

    const listener = jest.fn();
    result.addSquishListener(listener);

    /**
     * @todo find way to get SquishDriver DOM node and fire event below:
     * const event = new CustomEvent('squish', {
     * progress: 1,
     * });
     * squishDriverEl.dispatchEvent(event);
     */

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it.todo('can unsubscribe from squish events', () => {
    const { result } = renderHook({
      callback: () => useLayoutContext(),
      options: {
        wrapper: LayoutProvider,
      },
    });

    const listener = jest.fn();
    result.addSquishListener(listener);
    result.removeSquishListener(listener);

    /**
     * @todo find way to get SquishDriver DOM node and fire event below:
     * const event = new CustomEvent('squish', {
     * progress: 1,
     * });
     * squishDriverEl.dispatchEvent(event);
     */

    expect(listener).toHaveBeenCalledTimes(0);
  });
});
