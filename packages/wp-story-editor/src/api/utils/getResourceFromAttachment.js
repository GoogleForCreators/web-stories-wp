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
  getTypeFromMime,
  getResourceSize,
} from '@googleforcreators/media';
import { snakeToCamelCaseObjectKeys } from '@web-stories-wp/wp-utils';

/**
 * @typedef {import('@googleforcreators/media').Resource} Resource
 */

/**
 * MediaDetails object.
 *
 * @typedef {Object} MediaDetails Media details object.
 * @property {number} width Media width.
 * @property {number} height Media height.
 * @property {number} length Video duration.
 * @property {string} length_formatted Formatted video duration.
 */

/**
 * WPAttachment object.
 *
 * @typedef {Object} WPAttachment WordPress media object.
 * @property {number} id Numeric attachment ID.
 * @property {string} date_gmt Creation date in GMT.
 * @property {string} mime_type Media mime type.
 * @property {number} featured_media ID of the media item's poster ID.
 * @property {string} alt_text Alt text.
 * @property {string} source_url Media URL.
 * @property {string} web_stories_media_source Media source.
 * @property {MediaDetails} media_details Media details.
 */

function getImageResourceFromAttachment(attachment) {
  const {
    id,
    date_gmt,
    media_details: { width, height, sizes: _sizes = {} } = {},
    mime_type: mimeType,
    alt_text: alt,
    source_url: src,
    meta: { web_stories_base_color: baseColor, web_stories_blurhash: blurHash },
  } = attachment;

  const sizes = Object.entries(_sizes).reduce((sizes, [key, value]) => {
    sizes[key] = snakeToCamelCaseObjectKeys(value);
    return sizes;
  }, {});

  return createResource({
    baseColor,
    blurHash,
    mimeType,
    creationDate: date_gmt,
    src,
    width,
    height,
    id,
    alt,
    sizes,
    local: false,
    isExternal: false,
  });
}

function getVideoResourceFromAttachment(attachment) {
  const {
    id,
    date_gmt,
    media_details: { width, height, length, length_formatted: lengthFormatted },
    mime_type: mimeType,
    featured_media: posterId,
    featured_media_src: {
      src: poster,
      width: posterWidth,
      height: posterHeight,
      generated: posterGenerated,
    },
    web_stories_is_muted: isMuted,
    alt_text: alt,
    source_url: src,
    web_stories_media_source: mediaSource,
    meta: {
      web_stories_trim_data: trimData,
      web_stories_base_color: baseColor,
      web_stories_blurhash: blurHash,
    },
  } = attachment;

  return createResource({
    baseColor,
    blurHash,
    mimeType,
    creationDate: date_gmt,
    src,
    ...getResourceSize({
      width,
      height,
      posterGenerated,
      posterWidth,
      posterHeight,
    }),
    poster,
    posterId,
    id,
    length,
    lengthFormatted,
    alt,
    local: false,
    isExternal: false,
    isOptimized: 'video-optimization' === mediaSource,
    isMuted,
    trimData,
  });
}

function getGifResourceFromAttachment(attachment) {
  const {
    id,
    date_gmt,
    media_details: { width, height },
    mime_type: mimeType,
    featured_media: posterId,
    featured_media_src: {
      src: poster,
      width: posterWidth,
      height: posterHeight,
      generated: posterGenerated,
    },
    alt_text: alt,
    source_url: src,
    meta: { web_stories_base_color: baseColor, web_stories_blurhash: blurHash },
  } = attachment;

  return createResource({
    baseColor,
    blurHash,
    type: 'gif',
    mimeType: 'image/gif',
    creationDate: date_gmt,
    src,
    ...getResourceSize({
      width,
      height,
      posterGenerated,
      posterWidth,
      posterHeight,
    }),
    posterId,
    poster,
    id,
    alt,
    local: false,
    isOptimized: true,
    isExternal: false,
    output: {
      mimeType: mimeType,
      src: src,
    },
  });
}

/**
 * Generates a resource object from a WordPress attachment.
 *
 * @param {WPAttachment} attachment WP Attachment object.
 * @return {Resource} Resource object.
 */
function getResourceFromAttachment(attachment) {
  const {
    mime_type: mimeType,
    web_stories_media_source: mediaSource,
    meta: { web_stories_is_gif: isGif = false } = {},
  } = attachment;

  if ('gif-conversion' === mediaSource || isGif) {
    return getGifResourceFromAttachment(attachment);
  }

  const type = getTypeFromMime(mimeType);

  if (type === 'image') {
    return getImageResourceFromAttachment(attachment);
  } else {
    return getVideoResourceFromAttachment(attachment);
  }
}

export default getResourceFromAttachment;
