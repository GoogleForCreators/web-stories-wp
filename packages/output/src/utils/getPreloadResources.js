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
 * AMP Extension
 *
 * @typedef {Object} PreloadResource
 * @property {string} url The URL to the resource.
 * @property {string} type Type of resource, e.g. "video" or "image".
 */

/**
 * Goes through all pages in a story to find the resources that should be preloaded.
 *
 * Currently this includes the first page's background image/video.
 *
 * @param {Array} pages List of pages.
 * @return {Array<PreloadResource>} List of preload resources.
 */
function getPreloadResources(pages) {
  const preloadResources = [];

  if (pages.length === 0) {
    return preloadResources;
  }

  for (const { type, resource, isBackground } of pages[0].elements) {
    if (!['image', 'video', 'gif'].includes(type)) {
      continue;
    }

    if (!isBackground) {
      continue;
    }

    // resource?.output?.src is used only for GIF resources.
    const src = resource?.output?.src || resource.src;

    preloadResources.push({
      url: src,
      type: 'image' === type ? 'image' : 'video',
    });
  }

  return preloadResources;
}

export default getPreloadResources;
