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

/**
 * Internal dependencies
 */

import {
  basicDropDownOptions,
  nestedDropDownOptions,
} from '../../../testUtils/sampleData';
import useSearch from '../useSearch';

describe('useSearch()', function () {
  it('should return falsy for activeOption when no selectedValue is present', () => {
    const { result } = renderHook(() => useSearch({ options: [] }));

    expect(result.current.activeOption).toBeFalsy();
  });

  it('should return object from options containing selectedValue as active option', () => {
    const { result } = renderHook(() =>
      useSearch({
        selectedValue: basicDropDownOptions[2],
        options: basicDropDownOptions,
      })
    );

    expect(result.current.activeOption).toMatchObject(basicDropDownOptions[2]);
  });

  it('should return null for activeOption when selectedValue is empty', () => {
    const { result } = renderHook(() =>
      useSearch({
        selectedValue: {},
        options: basicDropDownOptions,
      })
    );

    act(() => {
      result.current.inputState.set('freeform answer not in options');
    });

    expect(result.current.activeOption).toBeNull();
    expect(result.current.inputState.value).toBe(
      'freeform answer not in options'
    );
  });

  it('should return an empty array when no options are present', () => {
    const { result } = renderHook(() =>
      useSearch({ selectedValue: {}, options: [] })
    );

    expect(result.current.normalizedOptions).toStrictEqual([]);
  });

  it('should return an empty array when only bad options are present', function () {
    const { result } = renderHook(() =>
      useSearch({
        selectedValue: {},
        options: [
          'things that are not good for a dropDown',
          1,
          { 500: '', foo: () => {} },
        ],
      })
    );

    expect(result.current.normalizedOptions).toStrictEqual([]);
  });

  it('should return only sanitized options that meet requirements', function () {
    const { result } = renderHook(() =>
      useSearch({ selectedValue: {}, options: nestedDropDownOptions })
    );

    expect(result.current.normalizedOptions).toStrictEqual([
      {
        group: [
          { label: 'ET', value: 'alien-1' },
          { label: 'Stitch', value: 'alien-2' },
          { label: 'Groot', value: 'alien-3' },
          { label: 'The Worm Guys', value: 'alien-4' },
          { label: "Na'vi", value: 'alien-5' },
          { label: 'Arachnids', value: 'alien-6' },
          { label: 'The Predator', value: 'alien-7' },
          { label: 'Xenomorph', value: 'alien-8' },
        ],
        label: 'aliens',
      },
      {
        group: [
          { label: 'Smaug', value: 'dragon-1' },
          { label: 'Mushu', value: 'dragon-2' },
          { label: 'Toothless', value: 'dragon-3' },
          { label: 'Falkor', value: 'dragon-4' },
          { label: 'Drogon', value: 'dragon-5' },
          { label: 'Kalessin', value: 'dragon-6' },
        ],
        label: 'dragons',
      },
      {
        group: [
          { label: 'Snoopy', value: 'dog-1' },
          { label: 'Scooby', value: 'dog-2' },
        ],
        label: 'dogs',
      },
    ]);
  });
});
