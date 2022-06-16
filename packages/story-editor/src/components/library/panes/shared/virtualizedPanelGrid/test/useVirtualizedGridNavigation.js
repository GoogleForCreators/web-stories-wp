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
import { renderHook, act } from '@testing-library/react';
import { createRef } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import useVirtualizedGridNavigation from '../useVirtualizedGridNavigation';

describe('useVirtualizedGridNavigation()', function () {
  it('should initially return focus booleans as false', function () {
    const { result } = renderHook(
      () =>
        useVirtualizedGridNavigation({
          containerRef: createRef(),
          gridItemRefs: { current: [] },
          gritItemIds: [],
          rowVirtualizer: { virtualItems: [] },
        }),
      {}
    );

    expect(result.current.activeGridItemId).toBeUndefined();
    expect(result.current.isGridFocused).toBe(false);
  });

  it('should update isGridFocused to true and set activeGridItemId to first index when handleGridFocus is called', function () {
    const { result } = renderHook(
      () =>
        useVirtualizedGridNavigation({
          containerRef: createRef(),
          gridItemRefs: { current: [] },
          gridItemIds: ['one', 'two', 'three'],
          rowVirtualizer: { virtualItems: [] },
        }),
      {}
    );

    act(() => {
      result.current.handleGridFocus();
    });

    expect(result.current.activeGridItemId).toBe('one');
    expect(result.current.isGridFocused).toBe(true);
  });

  it('should update activeGridItemId when handleGridItemFocus is called', function () {
    const { result } = renderHook(
      () =>
        useVirtualizedGridNavigation({
          containerRef: createRef(),
          gridItemRefs: { current: [] },
          gridItemIds: ['one', 'two', 'three'],
          rowVirtualizer: { virtualItems: [] },
        }),
      {}
    );
    expect(result.current.activeGridItemId).toBeUndefined();

    act(() => {
      result.current.handleGridItemFocus('two');
    });

    expect(result.current.activeGridItemId).toBe('two');
  });
});
