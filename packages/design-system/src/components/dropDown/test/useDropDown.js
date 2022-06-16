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
import { renderHook } from '@testing-library/react';

/**
 * Internal dependencies
 */

import {
  basicDropDownOptions,
  nestedDropDownOptions,
} from '../../../testUtils/sampleData';
import useDropDown from '../useDropDown';

describe('useDropDown()', function () {
  it('should return falsy for activeOption when no selectedValue is present', function () {
    const { result } = renderHook(() => useDropDown({ options: [] }));

    expect(result.current.activeOption).toBeFalsy();
  });

  it('should return object from options containing selectedValue as active option', function () {
    const { result } = renderHook(() =>
      useDropDown({
        selectedValue: basicDropDownOptions[2].value,
        options: basicDropDownOptions,
      })
    );

    expect(result.current.activeOption).toMatchObject(basicDropDownOptions[2]);
  });

  it('should return falsy for activeOption when selectedValue is not present in options', function () {
    const { result } = renderHook(() =>
      useDropDown({
        selectedValue: 'bogus value',
        options: basicDropDownOptions,
      })
    );

    expect(result.current.activeOption).toBeFalsy();
  });

  it('should return an empty array when no options are present', function () {
    const { result } = renderHook(() =>
      useDropDown({ selectedValue: null, options: [] })
    );

    expect(result.current.normalizedOptions).toStrictEqual([]);
  });

  it('should return an empty array when only bad options are present', function () {
    const { result } = renderHook(() =>
      useDropDown({
        selectedValue: null,
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
      useDropDown({ selectedValue: null, options: nestedDropDownOptions })
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
