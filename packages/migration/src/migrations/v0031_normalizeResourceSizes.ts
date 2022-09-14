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

function normalizeResourceSizes({ pages, ...rest }) {
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

function updateElement(element) {
  if (element.resource) {
    element.resource.width = Number(element.resource.width);
    element.resource.height = Number(element.resource.height);

    if (element.resource.sizes) {
      for (const size of Object.keys(element.resource.sizes)) {
        // Disable reason: not acting on untrusted user input.
        const data = element.resource.sizes[size];
        element.resource.sizes[size] = {
          ...data,
          width: Number(data.width),
          height: Number(data.height),
        };
      }
    }
  }

  return element;
}

export default normalizeResourceSizes;
