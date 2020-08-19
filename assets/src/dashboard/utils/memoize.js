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
export default function memoize(func, argsHash = (args) => args.join('-')) {
  const memoized = new Map();
  return function (...args) {
    const key = argsHash(args);
    /**
     * The map value should only ever be undefined if
     * func has never been called with this arg key.
     *
     * This allows us to memoize functions with
     * `null` or `false` return values.
     */
    if (memoized.get(key) === undefined) {
      const value = func(...args);
      memoized.set(key, value === undefined ? 'IS_VOID' : value);
    }
    /**
     * `IS_VOID` is how we indicate that a function
     * has been called with a given argument key, and the return
     * value of that call was undefined.
     */
    if (memoized.get(key) === 'IS_VOID') {
      return undefined;
    }

    return memoized.get(key);
  };
}
