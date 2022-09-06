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

describe('memoize(func)', () => {
  it('memoizes with a single argument regardless of input type', () => {
    const memoized = memoize((a) => ({ a }));

    const funcArg = () => {};
    const objArg = {};

    expect(memoized('a')).toStrictEqual(memoized('a'));
    expect(memoized(0)).toStrictEqual(memoized(0));
    expect(memoized(1)).toStrictEqual(memoized(1));
    expect(memoized(funcArg)).toStrictEqual(memoized(funcArg));
    expect(memoized(objArg)).toStrictEqual(memoized(objArg));
  });
});
