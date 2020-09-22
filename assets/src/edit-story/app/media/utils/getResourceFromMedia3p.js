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
import { PROVIDERS } from '../media3p/providerConfiguration';
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
 * @property {string} mimeType The mime type of the image.
 * @property {number} width The width of the image.
 * @property {number} height The height of the image.
 * @property {?string} url The url.
 */

/**
 * VideoUrl object.
 *
 * @typedef {Object} VideoUrl video url object.
 * @property {string} mimeType The mime type of the video.
 * @property {number} width The width of the image.
 * @property {number} height The height of the image.
 * @property {?string} url The url.
 */

/**
 * Media3pMedia object.
 *
 * @typedef {Object} Media3pMedia Media3p media object.
 * @property {string} name The name of the media object. Format is
 * 'media/{provider}:{id}.
 * @property {string} provider The provider.
 * @property {string} type The type of media, currently 'IMAGE' or 'VIDEO'.
 * @property {Author} author The metadata about the author of the media object.
 * @property {?string} title The displayable title of the media item.
 * @property {?string} description A description of the media item.
 * @property {string} createTime The creation time of the media element.
 * @property {string} updateTime The last update time of the media element.
 * @property {?string} registerUsageUrl The optional URL to call when the media
 * element is added to a story.
 * @property {ImageUrl[]|undefined} imageUrls If the media element is an
 * image, an array of urls with different size assets. If the media element is
 * a video, then poster / thumbnail images.
 * @property {VideoUrl[]|undefined} videoUrls If the media element is a
 * video, an array of urls with different fidelity, eg. full or preview.
 */

/**
 * Converts the image urls in a Media3P Media object to the "sizes"
 * object required for a Resource.
 *
 * @param {Media3pMedia} m The Media3P Media object.
 * @param {?function(string):boolean} mimeTypeSelector An optional selector
 * of image mime types to include.
 * @return {Object} The array of "sizes"-type objects.
 */
function getImageUrls(m, mimeTypeSelector = () => true) {
  if (!['image', 'gif'].includes(m.type.toLowerCase())) {
    throw new Error('Invalid media type.');
  }

  // The rest of the application expects 3 named "sizes": "full", "large" and
  // "web_stories_thumbnail". We use the biggest as "full", the next biggest
  // as "large", and the smallest as "web_stories_thumbnail". The rest are
  // named according to their size.
  if (m.imageUrls?.length < 3) {
    throw new Error('Invalid number of urls for asset. Need at least 3: ' + m);
  }

  const sortedImages = m.imageUrls
    .filter((i) => mimeTypeSelector(i.mimeType))
    .sort((x, y) => (y.width ?? 0) - (x.width ?? 0));
  const originalSize = getOriginalSize(sortedImages);
  const sizesFromBiggest = sortedImages.map((u) =>
    mediaUrlToImageSizeDescription(m, u, originalSize)
  );

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

/**
 * Converts the video urls in a Media3P Media object to the "sizes"
 * object required for a Resource.
 *
 * @param {Media3pMedia} m The Media3P Media object.
 * @return {Object} The array of "sizes"-type objects.
 */
function getVideoUrls(m) {
  if (m.type.toLowerCase() !== 'video') {
    throw new Error('Invalid media type.');
  }

  // The rest of the application expects 2 named "sizes": "full", and "preview"
  // The highest fidelity is used (videoUrls is ordered by fidelity from the backend)
  // as "full", and the lowest as "preview".
  if (m.videoUrls?.length < 2) {
    throw new Error('Invalid number of urls for asset. Need at least 2: ' + m);
  }

  const sortedVideos = m.videoUrls.sort(
    (x, y) => (y.width ?? 0) - (x.width ?? 0)
  );
  const originalSize = getOriginalSize(sortedVideos);
  const sizesFromBiggest = sortedVideos.map((u) =>
    mediaUrlToImageSizeDescription(m, u, originalSize)
  );

  return {
    full: sizesFromBiggest[0],
    preview: sizesFromBiggest[sizesFromBiggest.length - 1],
  };
}

function getOriginalSize(mediaUrls) {
  return {
    originalWidth: mediaUrls[0].width,
    originalHeight: mediaUrls[0].height,
  };
}

function mediaUrlToImageSizeDescription(media, url, originalSize) {
  const { originalWidth, originalHeight } = originalSize;
  if (!originalWidth || !originalHeight) {
    throw new Error('No original size present.');
  }
  const provider = PROVIDERS[media.provider.toLowerCase()];
  if ((!url.width || !url.height) && !provider.defaultPreviewWidth) {
    throw new Error('Missing width and height for: ' + media);
  }
  return {
    file: media.name,
    source_url: url.url,
    mime_type: url.mimeType,
    width: url.width ?? provider.defaultPreviewWidth,
    height:
      url.height ??
      (provider.defaultPreviewWidth * originalHeight) / originalWidth,
  };
}

function getAttributionFromMedia3p(m) {
  return (
    (m.author || m.registerUsageUrl) && {
      author: m.author && {
        displayName: m.author.displayName,
        url: m.author.url,
      },
      registerUsageUrl: m.registerUsageUrl,
    }
  );
}

function formatVideoLength(length) {
  const minutes = Math.floor(length / 60);
  const seconds = Math.floor(length % 60);
  return minutes + ':' + seconds.toString().padStart(2, '0');
}

function getImageResourceFromMedia3p(m) {
  const imageUrls = getImageUrls(m);
  return createResource({
    id: m.name,
    type: m.type.toLowerCase(),
    mimeType: imageUrls.full.mime_type,
    creationDate: m.createTime,
    src: imageUrls.full.source_url,
    width: imageUrls.full.width,
    height: imageUrls.full.height,
    title: m.description,
    alt: null,
    local: false,
    sizes: imageUrls,
    attribution: getAttributionFromMedia3p(m),
  });
}

function getVideoResourceFromMedia3p(m) {
  const videoUrls = getVideoUrls(m);
  const length = parseInt(m.videoMetadata.duration.trimEnd('s'));
  return createResource({
    id: m.name,
    type: m.type.toLowerCase(),
    mimeType: videoUrls.full.mime_type,
    creationDate: m.createTime,
    src: videoUrls.full.source_url,
    width: videoUrls.full.width,
    height: videoUrls.full.height,
    poster: m.imageUrls[0].url,
    length,
    lengthFormatted: formatVideoLength(length),
    title: m.description,
    alt: null,
    local: false,
    sizes: videoUrls,
    attribution: getAttributionFromMedia3p(m),
  });
}

function getGifResourceFromMedia3p(m) {
  const imageUrls = getImageUrls(m, (mime) => mime.includes('gif'));
  return createResource({
    type: m.type.toLowerCase(),
    mimeType: imageUrls.full.mime_type,
    creationDate: m.createTime,
    src: imageUrls.full.source_url,
    width: imageUrls.full.width,
    height: imageUrls.full.height,
    title: m.description,
    alt: null,
    local: false,
    sizes: imageUrls,
    attribution: getAttributionFromMedia3p(m),
  });
}

/**
 * Generates a resource object from a Media3P object from the API.
 *
 * @param {Media3pMedia} m A Media3P Media object.
 * @return {import('./createResource.js').Resource} Resource object.
 */
export default function getResourceFromMedia3p(m) {
  switch (m.type.toLowerCase()) {
    case 'image':
      return getImageResourceFromMedia3p(m);
    case 'video':
      return getVideoResourceFromMedia3p(m);
    case 'gif':
      return getGifResourceFromMedia3p(m);
    default:
      throw new Error('Invalid media type.');
  }
}
