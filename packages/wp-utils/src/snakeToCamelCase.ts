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
 * @param string The key in snake case
 * @return The key in camel case
 */
export function snakeToCamelCase(string = '') : string {
  if (!string.includes('_') && !string.includes('-')) {
    return string;
  }

  return string
    .toLowerCase()
    .replace(
      /([a-z])([_|-][a-z])/g,
      (_match, group1: string, group2: string) =>
        group1 + group2.toUpperCase().replace('_', '').replace('-', '')
    );
}

type ObjectOrPrimitive = SnakeOrCamelCaseObject | unknown;

interface SnakeOrCamelCaseObject {
  [key: string]: ObjectOrPrimitive;
}

function isObject (obj: unknown) {
  return obj && 'object' === typeof obj && !Array.isArray(obj);
}

/**
 * Transform a given object keys from snake case to camel case recursively.
 *
 * @param obj Object to be transformed.
 * @param ignore Array of keys to be ignored for camelcase.
 * @return Transformed object.
 */
export function snakeToCamelCaseObjectKeys(
  obj: ObjectOrPrimitive,
  ignore: string[] = []
): ObjectOrPrimitive {
  if (!isObject(obj)) {
    return obj;
  }

  return Object.fromEntries(
    Object.entries(obj as SnakeOrCamelCaseObject).map(
      ([key, value]: [string, ObjectOrPrimitive]) => {
        return [
          snakeToCamelCase(key),
          isObject(value) && !ignore.includes(key)
            ? snakeToCamelCaseObjectKeys(value)
            : value,
        ] as [string, SnakeOrCamelCaseObject];
      }
    )
  );
}
