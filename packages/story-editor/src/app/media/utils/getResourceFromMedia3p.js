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
 * External dependencies
 */
import {
  createResource,
  getVideoLengthDisplay,
} from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { PROVIDERS } from '../media3p/providerConfiguration';

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
 * @return {Object} The array of "sizes"-type objects.
 */
function getImageUrls(m) {
  // The rest of the application expects 3 named "sizes": "full", "large" and
  // "web_stories_thumbnail". We use the biggest as "full", the next biggest
  // as "large", and the smallest as "web_stories_thumbnail". The rest are
  // named according to their size.
  if (m.imageUrls?.length < 3) {
    throw new Error('Invalid number of urls for asset. Need at least 3: ' + m);
  }

  const sizesFromBiggest = sortMediaBySize(m, m.imageUrls);

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
 * Converts the gif urls in a Media3P Media object to the "sizes"
 * object required for a resource
 *
 * @param {Media3pMedia} m The Media3P Media object
 * @return {Object} The array of "sizes"-type objects.
 */

function getGifUrls(m) {
  // The rest of the application expects 3 named "sizes": "full", "large" and
  // "web_stories_thumbnail". We use the biggest as "full", the next biggest
  // as "large", and the smallest as "web_stories_thumbnail". The rest are
  // named according to their size.
  if (m.imageUrls?.length < 3) {
    throw new Error('Invalid number of urls for asset. Need at least 3: ' + m);
  }

  const previewUrl = m.imageUrls
    .filter(({ imageName }) => imageName.endsWith('preview'))
    .map(({ url }) => url)
    .shift();

  // Prevents the static preview image from appearing in this list
  // which should only contain animated GIFs.
  const imageUrls = m.imageUrls.filter(({ url }) => url !== previewUrl);

  const imageSizesFromBiggest = sortMediaBySize(m, imageUrls);
  const webmSizes = sortMediaBySize(
    m,
    m.videoUrls.filter(({ mimeType }) => mimeType === 'image/webm')
  );
  const mp4Sizes = sortMediaBySize(
    m,
    m.videoUrls.filter(({ mimeType }) => mimeType === 'video/mp4')
  );

  const namedSizes = [
    ['full', imageSizesFromBiggest[0]],
    ['large', imageSizesFromBiggest[1]],
    ...imageSizesFromBiggest
      .slice(2, imageSizesFromBiggest.length - 1)
      .map((u) => [u.width + '_' + u.height, u]),
    [
      'web_stories_thumbnail',
      imageSizesFromBiggest[imageSizesFromBiggest.length - 1],
    ],
  ];

  return {
    imageUrls: Object.fromEntries(new Map(namedSizes)),
    videoUrls: {
      webm: {
        full: webmSizes[0],
        preview: webmSizes[webmSizes.length - 1],
      },
      mp4: {
        full: mp4Sizes[0],
        preview: mp4Sizes[webmSizes.length - 1],
      },
    },
    previewUrl,
  };
}

/**
 * Converts the video urls in a Media3P Media object to the "sizes"
 * object required for a Resource.
 *
 * @param {Media3pMedia} m The Media3P Media object.
 * @return {Object} The array of "sizes"-type objects.
 */
function getVideoUrls(m) {
  // The rest of the application expects 2 named "sizes": "full", and "preview"
  // The highest fidelity is used (videoUrls is ordered by fidelity from the backend)
  // as "full", and the lowest as "preview".
  if (m.videoUrls?.length < 2) {
    throw new Error('Invalid number of urls for asset. Need at least 2: ' + m);
  }

  const sizesFromBiggest = sortMediaBySize(m, m.videoUrls);

  return {
    full: sizesFromBiggest[0],
    preview: sizesFromBiggest[sizesFromBiggest.length - 1],
  };
}

function sortMediaBySize(m, mediaUrls) {
  const sortedUrls = mediaUrls.sort((x, y) => (y.width ?? 0) - (x.width ?? 0));
  const originalSize = getOriginalSize(sortedUrls);
  return sortedUrls.map((u) =>
    mediaUrlToImageSizeDescription(m, u, originalSize)
  );
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
    sourceUrl: url.url,
    mimeType: url.mimeType,
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

function getImageResourceFromMedia3p(m) {
  const imageUrls = getImageUrls(m);
  return createResource({
    id: m.name,
    baseColor: m.color,
    blurHash: m.blurHash,
    type: m.type.toLowerCase(),
    mimeType: imageUrls.full.mimeType,
    creationDate: m.createTime,
    src: imageUrls.full.sourceUrl,
    width: imageUrls.full.width,
    height: imageUrls.full.height,
    alt: m.description || m.title || m.name,
    isExternal: true,
    isPlaceholder: false,
    sizes: imageUrls,
    attribution: getAttributionFromMedia3p(m),
  });
}

function getVideoResourceFromMedia3p(m) {
  const videoUrls = getVideoUrls(m);
  const length = parseInt(m.videoMetadata.duration.trimEnd('s'));
  return createResource({
    id: m.name,
    baseColor: m.color,
    posterId: m.name,
    type: m.type.toLowerCase(),
    mimeType: videoUrls.full.mimeType,
    creationDate: m.createTime,
    src: videoUrls.full.sourceUrl,
    width: videoUrls.full.width,
    height: videoUrls.full.height,
    poster: m.imageUrls[0].url,
    length,
    lengthFormatted: getVideoLengthDisplay(length),
    alt: m.description || m.title || m.name,
    isExternal: true,
    isPlaceholder: false,
    isOptimized: true,
    isMuted: true,
    sizes: videoUrls,
    attribution: getAttributionFromMedia3p(m),
  });
}

function getGifResourceFromMedia3p(m) {
  const { imageUrls, videoUrls, previewUrl } = getGifUrls(m);
  return createResource({
    id: m.name,
    baseColor: m.color,
    posterId: m.name,
    type: m.type.toLowerCase(),
    mimeType: imageUrls.full.mimeType,
    creationDate: m.createTime,
    src: imageUrls.full.sourceUrl,
    width: imageUrls.full.width,
    height: imageUrls.full.height,
    poster: previewUrl,
    alt: m.description || m.title || m.name,
    isPlaceholder: false,
    isOptimized: true,
    isExternal: true,
    sizes: imageUrls,
    output: {
      mimeType: videoUrls.mp4.full.mimeType,
      src: videoUrls.mp4.full.sourceUrl,
    },
    attribution: getAttributionFromMedia3p(m),
  });
}

function getStickerResourceFromMedia3p(m) {
  // This way we'll only use WebP images and not GIFs by accident, which are heavier.
  const mWithWebP = {
    ...m,
    imageUrls: m.imageUrls.filter((i) => i.mimeType === 'image/webp'),
  };

  // Not using videos because of transparency.
  const imageUrls = getImageUrls(mWithWebP);
  return createResource({
    id: m.name,
    baseColor: m.color,
    blurHash: m.blurHash,
    type: 'image',
    mimeType: imageUrls.full.mimeType,
    creationDate: m.createTime,
    src: imageUrls.full.sourceUrl,
    width: imageUrls.full.width,
    height: imageUrls.full.height,
    alt: m.description || m.title || m.name,
    isExternal: true,
    isPlaceholder: false,
    sizes: imageUrls,
    attribution: getAttributionFromMedia3p(m),
  });
}

/**
 * Generates a resource object from a Media3P object from the API.
 *
 * @param {Media3pMedia} m A Media3P Media object.
 * @return {import('@googleforcreators/media').Resource} Resource object.
 */
export default function getResourceFromMedia3p(m) {
  switch (m.type.toLowerCase()) {
    case 'image':
      return getImageResourceFromMedia3p(m);
    case 'video':
      return getVideoResourceFromMedia3p(m);
    case 'gif':
      return getGifResourceFromMedia3p(m);
    case 'sticker':
      return getStickerResourceFromMedia3p(m);
    default:
      throw new Error('Invalid media type.');
  }
}
