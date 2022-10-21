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
  getResourceSize,
  ResourceInput,
} from '@googleforcreators/media';
import { snakeToCamelCaseObjectKeys } from '@web-stories-wp/wp-utils';

interface ResourceSize {
  /** The MIME type of the resource. E.g. "image/png". */
  mime_type: string;
  /** The source URL of the resource. */
  source_url: string;
  /** The natural width of the resource in physical pixels. */
  width: number;
  /** The natural height of the resource in physical pixels. */
  height: number;
}

interface MediaDetail {
  width: number;
  height: number;
  length?: number;
  length_formatted: string;
  sizes?: { [key: string]: ResourceSize } | never[];
}

interface FeatureMediaSrc {
  generated: boolean;
  height: number;
  src: string;
  width: number;
}

interface MediaPickerAttachment {
  id: number;
  alt: string;
  mime: string;
  date: string;
  src: string;
  url: string;
  featured_media?: number;
  featured_media_src?: FeatureMediaSrc;
  media_details: MediaDetail;
  trim_data: {
    original: number;
  };
  web_stories_base_color: string;
  web_stories_blurhash: string;
  web_stories_is_muted: boolean;
  web_stories_media_source: string;
}

/**
 * Generates a resource object from a WordPress media picker object.
 *
 * @param mediaPickerEl WP Media Picker object.
 * @return Resource object.
 */
const getResourceFromMediaPicker = (mediaPickerEl: MediaPickerAttachment) => {
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
    } = '' as FeatureMediaSrc,
    media_details: {
      width,
      height,
      length,
      length_formatted: lengthFormatted,
      sizes: _sizes = {},
    } = {} as MediaDetail,
    web_stories_media_source: mediaSource,
    web_stories_is_muted: isMuted,
    web_stories_base_color: baseColor,
    web_stories_blurhash: blurHash,
    trim_data: trimData,
  } = mediaPickerEl;

  const sizes = Object.entries(
    _sizes as { [key: string]: ResourceSize }
  ).reduce((rawSizes, [key, value]) => {
    rawSizes[key] = snakeToCamelCaseObjectKeys(value);
    return rawSizes;
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
  } as ResourceInput);
};

export default getResourceFromMediaPicker;
