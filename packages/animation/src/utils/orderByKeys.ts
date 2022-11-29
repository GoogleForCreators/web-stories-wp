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
 * Takes an object and an array of keys that specify how to order
 * properties.
 *
 * If the keys don't appear in the input object, they
 * won't appear in the resulting object.
 *
 * Any properties absent from the keys input will appear in same order
 * as original object properties, but after specified order keys.
 *
 * @param obj Object with keys to be sorted
 * @param keys Keys to prioritize in order
 * @return Input object with ordered keys
 */
export function orderByKeys<T>(
  obj: Record<string, T> = {},
  keys: string[] = []
) {
  const entries = Object.entries(obj);
  const pos = (s: string) =>
    keys.includes(s) ? keys.indexOf(s) : Number.MAX_SAFE_INTEGER;
  entries.sort(([a], [b]) => pos(a) - pos(b));
  return Object.fromEntries(entries);
}
