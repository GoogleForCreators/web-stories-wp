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
 * Creates a resource object.
 *
 * @param {import('./types').Attachment} attachment WordPress Attachment object.
 * @return {import('./types').Resource} Resource object.
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
