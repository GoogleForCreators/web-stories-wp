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
import { act, renderHook } from '@testing-library/react';

/**
 * Internal dependencies
 */
import useHashState, { hashToParams } from '../useHashState';

const hashKeyVal = (key) =>
  JSON.parse(decodeURI(hashToParams(window.location.hash).get(key)));

describe('useHashState', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('initializes with fallback if no value found under hash key', () => {
    const fallback = 4;
    const { result } = renderHook(() => useHashState('test', fallback));
    expect(result.current[0]).toBe(fallback);
  });

  it('updates hash key value on every update', () => {
    const key = 'test';
    const { result } = renderHook(() => useHashState(key, 5));
    expect(hashKeyVal(key)).toBe(5);

    act(() => result.current[1](10));
    expect(hashKeyVal(key)).toBe(10);

    act(() => result.current[1](15));
    expect(hashKeyVal(key)).toBe(15);
  });

  it('initializes with hash key value if it exists', () => {
    const key = 'test';
    const persisted = 86;
    window.location.hash = `${key}=${persisted}`;
    const { result } = renderHook(() => useHashState(key, 0));
    expect(result.current[0]).toBe(persisted);
  });

  it('can handle objects', () => {
    const key = 'test';
    const fallback = {
      one: 'thing',
      two: {
        three: 4,
      },
    };
    const addFive = (obj) => ({ ...obj, five: true });

    const { result: result1 } = renderHook(() => useHashState(key, fallback));
    act(() => result1.current[1](addFive));

    const { result: result2 } = renderHook(() => useHashState(key, null));
    expect(result2.current[0]).toStrictEqual(addFive(fallback));
  });
});
