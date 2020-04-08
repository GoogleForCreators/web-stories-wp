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
 * Generates a resource object from the upload API response object
 *
 * @param {Object} file The uploaded file payload.
 * @return {import('./createResource').Resource} Resource object.
 */
function getResourceFromUploadAPI(file) {
  const {
    id: videoId,
    guid: { rendered: src },
    mime_type: mimeType,
    media_details: {
      width,
      height,
      length,
      length_formatted: lengthFormatted,
      sizes,
    },
    featured_media: posterId,
    featured_media_src: {
      src: poster,
      width: posterWidth,
      height: posterHeight,
    },
  } = file;
  return createResource({
    mimeType,
    src,
    width,
    height,
    length,
    lengthFormatted,
    poster,
    posterWidth,
    posterHeight,
    posterId,
    videoId,
    sizes,
  });
}

export default getResourceFromUploadAPI;
