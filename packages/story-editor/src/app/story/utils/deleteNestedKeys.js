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
 * Dynamically deletes nested keys from on object by the defined paths.
 * Each path has to be in the format of nested keys separated by a dot, e.g. `foo.bar.a`
 *
 * @param {Object} object The objec to remove keys from.
 * @param {Array} paths Array of paths of keys.
 * @return {Object} Changed object.
 */
function deleteNestedKeys(object, paths) {
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
    const nextLastObj = keys.reduce((a, key) => a?.[key] || a, object);
    if (nextLastObj?.[nextLastKey]?.[lastKey]) {
      delete nextLastObj[nextLastKey][lastKey];
    }
  });
  return object;
}

export default deleteNestedKeys;
