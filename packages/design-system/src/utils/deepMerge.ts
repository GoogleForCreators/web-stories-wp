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

type Mergeable = Record<string, unknown>;
/**
 * Deep merge objects.
 */
export default function deepMerge(object: Mergeable, source: Mergeable = {}) {
  Object.entries(source).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value && 'object' === typeof value && !Array.isArray(value)) {
        if (!('key' in object)) {
          Object.assign(object, { [key]: {} });
        }
        deepMerge(object[key] as Mergeable, value as Mergeable);
      } else {
        Object.assign(object, { [key]: value });
      }
    }
  });

  return object;
}
