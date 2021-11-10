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
 * Deep merge objects.
 *
 * @param {Object} object object to override.
 * @param {Object} source Source object.
 * @return {Object} Merged object.
 */
export default function deepMerge(object, source = {}) {
  Object.entries(source).forEach(([key, value]) => {
    if (value && 'object' === typeof value && !Array.isArray(value)) {
      if (!object[key]) {
        Object.assign(object, { [key]: {} });
      }
      deepMerge(object[key], value);
    } else {
      Object.assign(object, { [key]: value });
    }
  });

  return object;
}
