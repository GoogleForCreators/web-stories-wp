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

function camelCaseResourceSizes({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

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

function snakeToCamelCaseObjectKeys(obj) {
  return Object.entries(obj).reduce((_obj, [key, value]) => {
    _obj[snakeToCamelCase(key)] = value;
    return _obj;
  }, {});
}

function updateElement(element) {
  if (element?.resource?.sizes) {
    for (const [key, value] of Object.entries(element.resource.sizes)) {
      // eslint-disable-next-line security/detect-object-injection
      element.resource.sizes[key] = snakeToCamelCaseObjectKeys(value);
    }
  }
  return element;
}

export default camelCaseResourceSizes;
