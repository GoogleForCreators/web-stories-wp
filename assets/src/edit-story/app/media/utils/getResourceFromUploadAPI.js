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
import getTypeFromMime from './getTypeFromMime';

/**
 * Generates a resource object from the upload API response object
 *
 * @param {Object} file The uploaded file payload.
 * @return {Object} Resource object.
 */
export const getResourceFromUploadAPI = (file) => {
  const {
    guid: { rendered: src },
    mime_type: mimeType,
    media_details: { width, height, length_formatted: lengthFormatted },
    id: videoId,
    featured_media: posterId,
    featured_media_src: poster,
  } = file;
  const type = getTypeFromMime(mimeType);
  return {
    type,
    src,
    width,
    height,
    mimeType,
    lengthFormatted,
    oWidth: width,
    oHeight: height,
    ...(type === 'video' ? { posterId, poster, videoId } : {}),
  };
};

export default getResourceFromUploadAPI;
