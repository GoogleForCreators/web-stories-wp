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
import memoize from '../memoize';

describe('memoize(func, argumentsHash)', () => {
  it('memoizes based off arguments', () => {
    const memoized = memoize((a, b, c) => ({
      a,
      b,
      c,
    }));

    const funcArg = () => {};
    const objArg = {};

    expect(memoized(1, 'prop', true)).toStrictEqual(memoized(1, 'prop', true));
    expect(memoized(2, 'other-prop', false)).toStrictEqual(
      memoized(2, 'other-prop', false)
    );
    expect(memoized(funcArg, objArg, 5)).toStrictEqual(
      memoized(funcArg, objArg, 5)
    );
  });

  it('allows for a custom hashing function', () => {
    const memoized = memoize(
      (v) => v,
      () => 'hashKey'
    );
    const value = { prop: 23 };
    expect(memoized(value)).toStrictEqual(value);
    expect(memoized({ prop: 'otherInput' })).toStrictEqual(value);
  });

  it('only calls the given function once per memoized param', () => {
    const func = jest.fn();
    const memoized = memoize(func);

    memoized(1, 2, 3);
    memoized(1, 2, 3);
    memoized(1, 2, 3);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1, 2, 3);
  });
});
