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
 * Resource object.
 *
 * TODO: Try to remove posterId (poster should be enough) and videoId (src)
 * should be enough.
 * TODO: We should just get the non-formatted numeric length. Formatting can
 * be done client-side.
 *
 * @typedef {Resource} Resource
 * @property {string|undefined} type Resource type. Currently only "image" and
 * "video" values are allowed. If not specified, will be calculated from the
 * mime-type.
 * @property {string} mimeType The MIME type.
 * @property {string} src The source URL.
 * @property {number} width The natural resource width.
 * @property {number} height The natural resource height.
 * @property {string|null} poster The poster URL for the "video" type.
 * @property {string|null} posterId The system poster ID.
 * @property {string|null} videoId The system video ID.
 * @property {number|null} length The length for the "video" type.
 * @property {string|null} lengthFormatted The formatted length for the "video"
 * type.
 * @property {string|null} title The user-readable title for the resource.
 * @property {string|null} alt The user-readable accessibility label for the
 * resource.
 * @property {boolean} local Whether the resource has been already uploaded to
 * the server.
 */

/**
 * Creates a resource object.
 *
 * @param {Object} attachment WP Attachment object
 * @return {Object} Resource object
 */
function createResource({
  type,
  mimeType,
  src,
  width,
  height,
  poster,
  posterId,
  videoId,
  length,
  lengthFormatted,
  title,
  alt,
  local,
}) {
  return {
    type: type || getTypeFromMime(mimeType),
    mimeType,
    src,
    width,
    height,
    poster,
    posterId,
    videoId,
    length,
    lengthFormatted,
    title,
    alt,
    local,
  };
}

export default createResource;
