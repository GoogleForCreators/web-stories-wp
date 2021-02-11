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
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import useTypeahead from '../useTypeahead';

const demoItems = [
  { value: '1', label: 'one' },
  { value: 'foo', label: 'two' },
  { value: false, label: 'invalid option' },
  { value: 'bar', label: 'three' },
];

describe('useTypeahead()', function () {
  it('should have the default options initially set', function () {
    const { result } = renderHook(
      () => useTypeahead({ items: [], value: '' }),
      {}
    );

    expect(result.current.isMenuOpen).toBe(false);
    expect(result.current.isInputExpanded).toBe(false);
    expect(result.current.inputValue.value).toBe('');
    expect(result.current.showMenu.value).toBe(false);
    expect(result.current.menuFocused.value).toBe(false);
    expect(result.current.selectedValueIndex.value).toBe(-1);
  });

  it('should set isMenuOpen to true when input value updates.', () => {
    const { result } = renderHook(
      () => useTypeahead({ items: demoItems, value: 'coconut' }),
      {}
    );

    act(() => {
      result.current.showMenu.set(true);
    });
    expect(result.current.showMenu.value).toBe(true);
    expect(result.current.isMenuOpen).toBe(true);
    expect(result.current.selectedValueIndex.value).toBe(0);
  });
});
