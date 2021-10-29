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
import normalizeResourceSizes from './normalizeResourceSizes';

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
 * TrimData object
 *
 * @typedef {TrimData} TrimData data object linking a trimmed video to its original
 * @property {number} original The ID of the original video.
 * @property {string} start Time stamp of start time of new video. Example '00:01:02.345'.
 * @property {string} end Time stamp of end time of new video. Example '00:02:00'.
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
 * @property {string|null} lengthFormatted The formatted length for the "video" type.
 * @property {string|null} alt The user-readable accessibility label for the resource.
 * @property {boolean} local Whether the resource has been already uploaded to the server.
 * @property {boolean} isOptimized Whether the resource has already been optimized.
 * @property {boolean|null} isMuted Whether the resource has already been muted.
 * @property {boolean|null} isExternal Whether the resource is externally hosted.
 * @property {boolean|null} isPlaceholder Whether the resource is a placeholder.
 * @property {Object} sizes Object of image sizes.
 * @property {?Object} output An optional object of video sizes for rendering gifs as videos.
 * @property {?TrimData} trimData An optional object of video trim data.
 * @property {boolean} needsProxy Whether the resource needs a CORS proxy.
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
 * @typedef {Resource} Resource
 * @property {?Array.<number>} baseColor An optional attribution to detect the base color of a resource (an image or video). Value looks like [115, 71, 39].
 * @property {string|null} type Resource type. Currently only "image" and "video" values are allowed. If not specified, will be calculated from the mime-type.
 * @property {string} mimeType The MIME type.
 * @property {string|null} creationDate When resource was created.
 * @property {string} src The source URL.
 * @property {number} width The natural resource width.
 * @property {number} height The natural resource height.
 * @property {string|null} poster The poster URL for the "video" type.
 * @property {number|null} posterId The system poster ID.
 * @property {number|null} id The system ID.
 * @property {number|null} length The length for the "video" type.
 * @property {string|null} lengthFormatted The formatted length for the "video" type.
 * @property {string|null} alt The user-readable accessibility label for the resource.
 * @property {boolean} local Whether the resource has been already uploaded to the server.
 * @property {boolean} isOptimized Whether the resource has already been optimized.
 * @property {boolean} isMuted Whether the resource has already been muted.
 * @property {boolean} isExternal Whether the resource is externally hosted.
 * @property {boolean} isPlaceholder Whether the resource is a placeholder.
 * @property {Object.<string, ResourceSize>} sizes Object of image sizes.
 * @property {Attribution|null} attribution An optional attribution for the resource.
 * @property {?Object} output An optional object of video sizes for rendering gifs as videos
 * @property {?TrimData} trimData An optional object of video trim data.
 * @property {boolean} needsProxy Whether the resource needs a CORS proxy.
 */

/**
 * Creates a resource object.
 *
 * @param {Attachment} attachment WordPress Attachment object.
 * @return {Resource} Resource object.
 */
function createResource({
  baseColor,
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
  alt,
  sizes,
  attribution,
  output,
  local = false,
  isPlaceholder = false,
  isOptimized = false,
  isMuted = false,
  isExternal = false,
  trimData,
  needsProxy = false,
}) {
  return {
    baseColor,
    type: type || getTypeFromMime(mimeType),
    mimeType,
    creationDate,
    src,
    width: Number(width),
    height: Number(height),
    poster,
    posterId,
    id,
    length,
    lengthFormatted,
    alt,
    sizes: normalizeResourceSizes(sizes),
    attribution,
    output,
    local,
    isPlaceholder,
    isOptimized,
    isMuted,
    isExternal,
    trimData,
    needsProxy,
  };
}

export default createResource;
