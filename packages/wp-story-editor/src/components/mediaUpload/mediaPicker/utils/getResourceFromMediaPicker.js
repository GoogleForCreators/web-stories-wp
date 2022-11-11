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
import { createResource, getResourceSize } from '@googleforcreators/media';
import { snakeToCamelCaseObjectKeys } from '@web-stories-wp/wp-utils';

/**
 * Generates a resource object from a WordPress media picker object.
 *
 * @param {Object} mediaPickerEl WP Media Picker object.
 * @return {import('@googleforcreators/media').Resource} Resource object.
 */
const getResourceFromMediaPicker = (mediaPickerEl) => {
  const {
    src,
    url,
    mime: mimeType,
    alt,
    date,
    id,
    featured_media: posterId,
    featured_media_src: {
      src: poster,
      width: posterWidth,
      height: posterHeight,
      generated: posterGenerated,
    } = '',
    media_details: {
      width,
      height,
      length,
      length_formatted: lengthFormatted,
      sizes: _sizes = {},
    } = {},
    web_stories_media_source: mediaSource,
    web_stories_is_muted: isMuted,
    web_stories_base_color: baseColor,
    web_stories_blurhash: blurHash,
    trim_data: trimData,
  } = mediaPickerEl;

  const sizes = Object.entries(_sizes).reduce((sizes, [key, value]) => {
    sizes[key] = snakeToCamelCaseObjectKeys(value);
    return sizes;
  }, {});

  return createResource({
    baseColor,
    blurHash,
    mimeType,
    creationDate: date,
    src: url || src,
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
    sizes,
    local: false,
    isExternal: false,
    isOptimized: ['video-optimization', 'recording'].includes(mediaSource),
    isMuted,
    trimData,
  });
};

export default getResourceFromMediaPicker;
