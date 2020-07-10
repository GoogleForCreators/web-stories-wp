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

/**
 * Author object.
 *
 * @typedef {Object} Author Media3p media author.
 * @property {string} url The url for the asset.
 * @property {?string} imageName A name to identify this particular image url.
 * Currently not being used.
 * @property {number} width The width of this asset.
 * @property {number} height The height of this asset.
 */

/**
 * ImageUrl object.
 *
 * @typedef {Object} ImageUrl image url object.
 * @property {string} displayName The display name of the author of the media.
 * @property {?string} url A url to link to for the media author.
 */

/**
 * Media3pMedia object.
 *
 * @typedef {Object} Media3pMedia Media3p media object.
 * @property {string} name The name of the media object. Format is
 * 'media/{provider}:{id}.
 * @property {string} provider The provider, currently only 'UNSPLASH'.
 * @property {string} type The type of media, currently only 'IMAGE'.
 * @property {Author} author The metadata about the author of the media object.
 * @property {?string} title The displayable title of the media item.
 * @property {?string} description A description of the media item.
 * @property {string} createTime The creation time of the media element.
 * @property {string} updateTime The last update time of the media element.
 * @property {string} registerUsageUrl The URL to call when the media element
 * is added to a story.
 * @property {ImageUrl[]|undefined} imageUrls If the media element is an
 * image, an array of urls with different size assets.
 */

/**
 * Converts the image or video urls in a Media3P Media object to the "sizes"
 * object required for a Resource.
 *
 * @param {Media3pMedia} m The Media3P Media object.
 * @return {Object} The array of "sizes"-type objects.
 */
function getUrls(m) {
  if (m.type.toLowerCase() === 'image') {
    // The rest of the application expects 3 named "sizes": "full", "large" and
    // "web_stories_thumbnail". We use the biggest as "full", the next biggest
    // as "large", and the smallest as "web_stories_thumbnail". The rest are
    // named according to their size.
    if (m.imageUrls?.length < 3) {
      throw new Error(
        'Invalid number of urls for asset. Need at least 3: ' + m
      );
    }

    const sizesFromBiggest = m.imageUrls
      .sort((el1, el2) => el2.width - el1.width)
      .map((u) => ({
        file: m.name,
        source_url: u.url,
        mime_type: u.mimeType,
        width: u.width,
        height: u.height,
      }));
    const namedSizes = [
      ['full', sizesFromBiggest[0]],
      ['large', sizesFromBiggest[1]],
      ...sizesFromBiggest
        .slice(2, sizesFromBiggest.length - 1)
        .map((u) => [u.width + '_' + u.height, u]),
      ['web_stories_thumbnail', sizesFromBiggest[sizesFromBiggest.length - 1]],
    ];
    return Object.fromEntries(new Map(namedSizes));
  }
  throw new Error('Invalid media type.');
}

/**
 * Generates a resource object from a Media3P object from the API.
 *
 * @param {Media3pMedia} m A Media3P Media object.
 * @return {import('./createResource.js').Resource} Resource object.
 */
function getResourceFromMedia3p(m) {
  const urls = getUrls(m);
  return createResource({
    type: m.type.toLowerCase(),
    mimeType: urls.full.mime_type,
    creationDate: m.createTime,
    src: urls.full.source_url,
    width: urls.full.width,
    height: urls.full.height,
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
