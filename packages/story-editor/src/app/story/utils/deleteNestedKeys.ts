/*
 * Copyright 2021 Google LLC
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
 * Dynamically deletes nested keys from an object by the defined paths.
 * Each path has to be in the format of nested keys separated by a dot, e.g. `foo.bar.a`
 *
 * Note that this function mutates the original object.
 */
function deleteNestedKeys<T extends Record<string, unknown>>(paths: string[]) {
  return (object: T) => {
    paths.forEach((path) => {
      const keys = path.split('.');
      if (!keys.length) {
        return;
      }
      if (keys.length === 1) {
        delete object[keys[0]];
        return;
      }
      const lastKey = keys.pop();
      const nextLastKey = keys.pop();
      const nextLastObj = keys.reduce<Partial<T>>(
        (a, key) => a?.[key] || a,
        object
      );

      if (!nextLastObj || !nextLastKey || !lastKey) {
        return;
      }
      // Make sure we're not trying to get a property out of `undefined` or `null`.
      if (
        Object.prototype.hasOwnProperty.call(nextLastObj, nextLastKey) &&
        'object' === typeof nextLastObj[nextLastKey] &&
        nextLastObj[nextLastKey]
      ) {
        delete (nextLastObj[nextLastKey] as Record<string, unknown>)[lastKey];
      }
    });
  };
}

export default deleteNestedKeys;
