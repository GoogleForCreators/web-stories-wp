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
 * Internal dependencies
 */
import createResource from './createResource';

function getUrls(m) {
  if (m.type.toLowerCase() === 'image') {
    return Object.fromEntries(
      new Map(
        m.imageUrls.map((u) => [
          u.imageName,
          {
            file: m.name,
            source_url: u.url,
            mime_type: u.mimeType,
            width: u.width,
            height: u.height,
          },
        ])
      )
    );
  }
  throw new Error('Invalid media type.');
}

function getFullAsset(m) {
  if (m.type.toLowerCase() === 'image') {
    if (!m.imageUrls.length) {
      throw new Error('No imageUrls for media resource: ' + m);
    }
    // Reverse sort and get the largest width to determine the full asset.
    return m.imageUrls.sort((el1, el2) => el2.width - el1.width)[0];
  }
  throw new Error('Invalid media type for media resource: ' + m);
}

/**
 * Generates a resource object from a Media3P object from the API.
 *
 * @param {Object} m A Media3P Media object.
 * @return {import('./createResource.js').Resource} Resource object.
 */
function getResourceFromMedia3p(m) {
  const urls = getUrls(m);
  const fullAsset = getFullAsset(m);
  return createResource({
    type: m.type.toLowerCase(),
    mimeType: fullAsset.mimeType,
    creationDate: m.createTime,
    src: fullAsset.url,
    width: fullAsset.width,
    height: fullAsset.height,
    poster: null, // TODO: Implement for videos.
    posterId: null, // TODO: Implement for videos.
    id: m.name,
    length: null, // TODO: Implement for videos.
    lengthFormatted: null, // TODO: Implement for videos.
    title: m.description,
    alt: null,
    local: false, // TODO: How does this interact with the rest?
    sizes: urls, // TODO: Map with expected keys for canvas.
    attribution: m.author && {
      author: {
        displayName: m.author.displayName,
        url: m.author.url,
      },
    },
  });
}

export default getResourceFromMedia3p;
