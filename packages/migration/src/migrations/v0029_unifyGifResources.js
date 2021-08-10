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

function unifyGifResources({ pages, ...rest }) {
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
  if (element.type !== 'gif' || !element.resource) {
    return element;
  }

  element.resource.isOptimized = true;

  if (!element.resource.id) {
    element.resource.id = element.resource.alt;
  }

  if (!element.resource.posterId) {
    element.resource.posterId = element.resource.alt;
  }

  if (element.resource.output?.poster) {
    element.resource.poster = element.resource.output.poster;
    delete element.resource.output.poster;
  }

  if (element.resource.output.sizes) {
    delete element.resource.output?.sizes;
  }

  return element;
}

export default unifyGifResources;
