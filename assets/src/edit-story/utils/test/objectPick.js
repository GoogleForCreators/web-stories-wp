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
import objectPick from '../objectPick';

describe('objectPick', () => {
  it('should pick only the specified properties and only if they exist', () => {
    const setup = {
      a: 1,
      b: 2,
      c: 3,
    };
    const result = objectPick(setup, ['a', 'b', 'd']);
    const expected = {
      a: 1,
      b: 2,
      // Note no "c" or "d" here
    };
    expect(result).toStrictEqual(expected);
  });

  it('should do nothing for non-objects and empty objects', () => {
    expect(objectPick()).toStrictEqual({});
    expect(objectPick(null)).toStrictEqual({});
    expect(objectPick(1)).toStrictEqual({});
    expect(objectPick(false)).toStrictEqual({});
    expect(objectPick(true)).toStrictEqual({});
    expect(objectPick('1')).toStrictEqual({});
    expect(objectPick({})).toStrictEqual({});
  });
});
