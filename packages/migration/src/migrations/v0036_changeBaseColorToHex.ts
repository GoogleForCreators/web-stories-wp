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

function changeBaseColorToHex({ pages, ...rest }) {
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

function getHexFromSolidArray(baseColor) {
  const color = baseColor
    .map((n) => n.toString(16))
    .map((s) => s.padStart(2, '0'))
    .join('');
  return `#${color}`;
}

function updateElement(element) {
  if (Array.isArray(element?.resource?.baseColor)) {
    element.resource.baseColor = getHexFromSolidArray(
      element?.resource?.baseColor
    );
  }
  return element;
}

export default changeBaseColorToHex;
