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

import useDropdownMenu from '../menu/useDropdownMenu';
import {
  basicDropdownOptions,
  nestedDropdownOptions,
} from '../stories/sampleData';
import { getOptions } from '../utils';

describe('useDropdownMenu()', function () {
  it('should have the default options initially selected', function () {
    const { result } = renderHook(() =>
      useDropdownMenu({
        handleMenuItemSelect: () => {},
        options: getOptions(basicDropdownOptions),
        listRef: { current: null },
        onDismissMenu: () => {},
      })
    );

    expect(result.current.focusedIndex).toBe(0);
    expect(result.current.focusedValue).toBeUndefined();
  });

  it('should return focused index matching activeValue passed in initially if present', function () {
    const { result } = renderHook(() =>
      useDropdownMenu({
        activeValue: basicDropdownOptions[2].value,
        handleMenuItemSelect: () => {},
        options: getOptions(basicDropdownOptions),
        listRef: { current: null },
        onDismissMenu: () => {},
      })
    );

    expect(result.current.focusedIndex).toBe(2);
    expect(result.current.focusedValue).toBe(basicDropdownOptions[2].value);
  });

  it('should return focused index matching activeValue passed in initially if present in a nested list', function () {
    const { result } = renderHook(() =>
      useDropdownMenu({
        activeValue: 'dog-2',
        handleMenuItemSelect: () => {},
        options: getOptions(nestedDropdownOptions),
        listRef: { current: null },
        onDismissMenu: () => {},
      })
    );

    expect(result.current.focusedIndex).toBe(15);
    expect(result.current.focusedValue).toBe('dog-2');
  });
});
