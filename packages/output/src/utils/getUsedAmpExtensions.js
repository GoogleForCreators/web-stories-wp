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

/**
 * AMP Extension
 *
 * @typedef {Extension} Extension
 * @property {string} src The URL to the extension.
 * @property {?string} name The extension's name. Used for the custom-element attribute.
 */

/**
 * Goes through all pages in a story to find the needed AMP extensions for them.
 *
 * Always includes the runtime as well as the amp-story extension.
 *
 * @param {Array} pages List of pages.
 * @return {Array<Extension>} List of used AMP extensions.
 */
const getUsedAmpExtensions = (pages) => {
  const extensions = [
    // runtime.
    { src: 'https://cdn.ampproject.org/v0.js' },
    {
      name: 'amp-story',
      src: 'https://cdn.ampproject.org/v0/amp-story-1.0.js',
    },
  ];

  const ampVideo = {
    name: 'amp-video',
    src: 'https://cdn.ampproject.org/v0/amp-video-0.1.js',
  };

  for (const { elements } of pages) {
    for (const { type } of elements) {
      switch (type) {
        // Todo: eventually check for amp-fit-text if ever added.
        case 'video':
          extensions.push(ampVideo);
          break;
        default:
          break;
      }
    }
  }

  return [...new Set(extensions)];
};

export default getUsedAmpExtensions;
