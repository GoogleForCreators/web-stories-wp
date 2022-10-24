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

type ArgHash<K> = (args: K[]) => string;
export default function memoize<K, T>(
  func: (...args: K[]) => T,
  argsHash: ArgHash<K> = (args) => args.join('-')
) {
  const memoized = new Map<string, T>();
  return function (...args: K[]) {
    const key = argsHash(args);
    if (!memoized.has(key)) {
      const result = func(...args);
      memoized.set(key, result);
      return result;
    }
    // Here get() has signature `T | undefined` but because of has() above,
    // it must be T (which can technically still include undefined, but that's
    // besides the point).
    return memoized.get(key) as T;
  };
}
