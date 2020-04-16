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

function paddingToObject({ pages, ...rest }) {
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

function updateElement({ padding, type, ...rest }) {
  if ('text' !== type) {
    return {
      type,
      ...rest,
    };
  }
  // If padding is already set, just return as is.
  if (
    padding &&
    Object.prototype.hasOwnProperty.call(padding, 'vertical') &&
    Object.prototype.hasOwnProperty.call(padding, 'horizontal')
  ) {
    return {
      type,
      padding,
      ...rest,
    };
  }
  const newPadding = padding || 0;
  return {
    padding: {
      horizontal: newPadding,
      vertical: newPadding,
    },
    type,
    ...rest,
  };
}

export default paddingToObject;
