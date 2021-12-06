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
 * Takes a string that is in snake case and returns the same
 * term in camel case.
 *
 * @param {string} string The key in snake case
 * @return {string} The key in camel case
 */
export function snakeToCamelCase(string = '') {
  if (!string.includes('_') && !string.includes('-')) {
    return string;
  }

  return string
    .toLowerCase()
    .replace(
      /([a-z])([_|-][a-z])/g,
      (_match, group1, group2) =>
        group1 + group2.toUpperCase().replace('_', '').replace('-', '')
    );
}

/**
 * Transform a given object keys from snake case to camel case recursively.
 *
 * @param {Object} obj Object to be transformed.
 * @param {Object} ignore Array of keys to be ignored for camelcase.
 * @return {any} Transformed object.
 */
export function snakeToCamelCaseObjectKeys(obj, ignore = []) {
  const isObject = (val) =>
    val && 'object' === typeof val && !Array.isArray(val);

  if (!isObject(obj)) {
    return obj;
  }

  return Object.entries(obj).reduce((transformedObject, [key, value]) => {
    const camelCaseKey = snakeToCamelCase(key);
    transformedObject[camelCaseKey] =
      isObject(value) && !ignore.includes(key)
        ? snakeToCamelCaseObjectKeys(value)
        : value;
    return transformedObject;
  }, {});
}
