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
import getResourceSize from './getResourceSize';

/**
 * Generates a resource object from a WordPress media picker object.
 *
 * @param {Object} mediaPickerEl WP Media Picker object.
 * @return {import('./createResource').Resource} Resource object.
 */
const getResourceFromMediaPicker = (mediaPickerEl) => {
  const {
    src,
    url,
    mime: mimeType,
    width,
    title,
    alt,
    description,
    height,
    date,
    id,
    featured_media: posterId,
    featured_media_src: {
      src: poster,
      width: posterWidth,
      height: posterHeight,
      generated: posterGenerated,
    } = '',
    fileLength: lengthFormatted,
    sizes: mediaPickerSizes,
  } = mediaPickerEl;
  const sizes = Object.fromEntries(
    Object.entries(mediaPickerSizes || {}).map(([k, size]) => [
      k,
      {
        width: size.width,
        height: size.height,
        source_url: size.url,
      },
    ])
  );
  return createResource({
    mimeType,
    uploadDate: date,
    src: url || src,
    ...getResourceSize(
      width,
      height,
      posterGenerated,
      posterWidth,
      posterHeight
    ),
    poster,
    posterId,
    id,
    lengthFormatted,
    alt: alt || description || title,
    title,
    sizes,
    local: false,
  });
};

export default getResourceFromMediaPicker;
