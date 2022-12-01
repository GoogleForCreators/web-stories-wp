/*
 * Copyright 2021 Google LLC
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
  getImageDimensions,
  getTypeFromMime,
  preloadVideo,
  seekVideo,
  getVideoLength,
  hasVideoGotAudio,
} from '@googleforcreators/media';

/**
 * @typedef {Object} ResourceLike
 * @property {string} src Resource URL.
 * @property {string} mimeType Mime type.
 * @property {boolean} needsProxy Whether the resource needs a CORS proxy.
 */

/**
 * @typedef {import('@googleforcreators/media').Resource} Resource
 */

/**
 * Get a resource from a URL.
 *
 * @param {ResourceLike} resourceLike Resource-like object.
 * @return {Promise<Resource>} Resource object.
 */
async function getResourceFromUrl(resourceLike) {
  const {
    src,
    mimeType,
    width,
    height,
    isMuted,
    length,
    lengthFormatted,
    ...rest
  } = resourceLike;
  const type = getTypeFromMime(mimeType);

  if (!['image', 'video'].includes(type)) {
    throw new Error('Invalid media type.');
  }

  const hasDimensions = width && height;
  const videoHasMissingMetadata =
    !hasDimensions ||
    isMuted === null ||
    length === null ||
    lengthFormatted === null;

  const additionalData = {};

  // Only need to fetch metadata if not already provided.

  if (type === 'video' && videoHasMissingMetadata) {
    const video = await preloadVideo(src);
    await seekVideo(video);

    additionalData.width = video.videoWidth;
    additionalData.height = video.videoHeight;

    const videoLength = getVideoLength(video);

    additionalData.length = videoLength.length;
    additionalData.lengthFormatted = videoLength.lengthFormatted;

    additionalData.isMuted = !hasVideoGotAudio(video);
  }

  if (type === 'image' && !hasDimensions) {
    const dimensions = await getImageDimensions(src);
    additionalData.width = dimensions.width;
    additionalData.height = dimensions.height;
  }

  return createResource({
    type,
    width,
    height,
    isMuted,
    length,
    lengthFormatted,
    src,
    isExternal: true,
    mimeType,
    ...rest,
    ...additionalData,
  });
}

export default getResourceFromUrl;
