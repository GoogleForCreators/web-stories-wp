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
 * Author object
 *
 * @typedef {Author} Author
 * @property {string} displayName The display name of the author.
 * @property {?string} url An optional URL to link to the author's profile or
 * website.
 */

/**
 * Attribution object
 *
 * @typedef {Attribution} Attribution
 * @property {?Author} author The optional author of the media object.
 * @property {?string} registerUsageUrl The optional url to register the media
 * usage.
 */

/**
 * Attachment object.
 *
 * @typedef {Attachment} Attachment
 * @property {string} [type] Attachment type, e.g. video or image.
 * @property {string} mimeType The MIME type.
 * @property {string|null} creationDate When the attachment was created.
 * @property {string} src The source URL.
 * @property {number} width The natural resource width.
 * @property {number} height The natural resource height.
 * @property {string|null} poster The poster URL for the "video" type.
 * @property {number|null} posterId The system poster ID.
 * @property {number|null} id The system ID.
 * @property {number|null} length The length for the "video" type.
 * @property {string|null} lengthFormatted The formatted length for the "video"
 * type.
 * @property {string|null} title The user-readable title for the resource.
 * @property {string|null} alt The user-readable accessibility label for the
 * resource.
 * @property {boolean} local Whether the resource has been already uploaded to
 * the server.
 * @property {Object} sizes Object of image sizes.
 * @property {?Object} output An optional object of video sizes for rendering gifs as videos
 */

/**
 * ResourceSize object
 *
 * @typedef {ResourceSize} ResourceSize
 * @property {number} width The width of the ResourceSize.
 * @property {number} height The height of the ResourceSize.
 * @property {string} source_url The URL pointing to the resource for this size.
 * @property {string|null} mimeType The mimeType of this ResourceSize.
 */

/**
 * Resource object.
 *
 * TODO: Try to remove posterId (poster should be enough?)
 *
 * @typedef {Resource} Resource
 * @property {string|null} type Resource type. Currently only "image" and
 * "video" values are allowed. If not specified, will be calculated from the
 * mime-type.
 * @property {string} mimeType The MIME type.
 * @property {string|null} creationDate When resource was created.
 * @property {string} src The source URL.
 * @property {number} width The natural resource width.
 * @property {number} height The natural resource height.
 * @property {string|null} poster The poster URL for the "video" type.
 * @property {number|null} posterId The system poster ID.
 * @property {number|null} id The system ID.
 * @property {number|null} length The length for the "video" type.
 * @property {string|null} lengthFormatted The formatted length for the "video"
 * type.
 * @property {string|null} title The user-readable title for the resource.
 * @property {string|null} alt The user-readable accessibility label for the
 * resource.
 * @property {boolean} local Whether the resource has been already uploaded to
 * the server.
 * @property {Object.<string, ResourceSize>} sizes Object of image sizes.
 * @property {Attribution|null} attribution An optional attribution for the
 * resource.
 * @property {?Object} output An optional object of video sizes for rendering gifs as videos
 */

/**
 * Creates a resource object.
 *
 * @param {Attachment} attachment WordPress Attachment object.
 * @return {Resource} Resource object.
 */
function createResource({
  type,
  mimeType,
  creationDate,
  src,
  width,
  height,
  poster,
  posterId,
  id,
  length,
  lengthFormatted,
  title,
  alt,
  local,
  sizes,
  attribution,
  output,
}) {
  return {
    type: type || getTypeFromMime(mimeType),
    mimeType,
    creationDate,
    src,
    width,
    height,
    poster,
    posterId,
    id,
    length,
    lengthFormatted,
    title,
    alt,
    local,
    sizes,
    attribution,
    output,
  };
}

export default createResource;
