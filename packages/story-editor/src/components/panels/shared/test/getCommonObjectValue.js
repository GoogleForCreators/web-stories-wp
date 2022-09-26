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
 * Internal dependencies
 */
import getCommonObjectValue from '../getCommonObjectValue';
import { MULTIPLE_VALUE } from '../../../../constants';

describe('getCommonObjectValue', () => {
  it('should return matching values for the defined properties', () => {
    const matchingValue = 1;
    const elements = [
      {
        foo: {
          a: matchingValue,
          b: 2,
        },
      },
      {
        foo: {
          a: matchingValue,
          b: 1,
        },
      },
    ];
    const defaultShape = { a: 0, b: 0 };
    const obj = getCommonObjectValue(elements, 'foo', defaultShape);
    expect(obj.a).toStrictEqual(matchingValue);
  });

  it('should return default value for unmatching properties', () => {
    const matchingValue = 1;
    const elements = [
      {
        foo: {
          a: matchingValue,
          b: 2,
        },
      },
      {
        foo: {
          a: matchingValue,
          b: 1,
        },
      },
    ];
    const defaultShape = { a: 0, b: 0 };
    const obj = getCommonObjectValue(elements, 'foo', defaultShape);
    expect(obj.b).toStrictEqual(MULTIPLE_VALUE);
  });

  it('should only return defined properties', () => {
    const matchingValue = 1;
    const elements = [
      {
        foo: {
          a: matchingValue,
          b: 2,
          c: 1,
        },
      },
      {
        foo: {
          a: matchingValue,
          b: 1,
          c: 1,
        },
      },
    ];
    const defaultShape = { b: 0, c: 0 };
    const obj = getCommonObjectValue(elements, 'foo', defaultShape);
    expect(obj.a).toBeUndefined();
    expect(obj.b).toBeDefined();
    expect(obj.c).toBeDefined();
  });
});
