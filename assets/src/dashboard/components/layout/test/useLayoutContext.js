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
  it('should throw an error if used oustide Layout.Provider', () => {
    expect(() => {
      const {
        // eslint-disable-next-line no-unused-vars
        result: { current },
      } = renderHook(() => useLayoutContext());
    }).toThrow(
      Error('useLayoutContext() must be used within a <Layout.Provider />')
    );
  });

  it('should not throw an error if used inside LayoutProvider', () => {
    const { result } = renderHook(() => useLayoutContext(), {
      wrapper: LayoutProvider,
    });
    expect(result.current.error).toBeUndefined();
  });

  it.todo('has a setable squish height');
  it.todo('has a data.progress property on squish events');
});
