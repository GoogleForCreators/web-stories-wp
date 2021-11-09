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
  getVideoDimensions,
  getVideoLength,
  hasVideoGotAudio,
  getTypeFromMime,
} from '@web-stories-wp/media';

/**
 * @typedef {Object} ResourceLike
 * @property {string} src Resource URL.
 * @property {string} mimeType Mime type.
 * @property {boolean} needsProxy Whether the resource needs a CORS proxy.
 */

/**
 * @typedef {import('@web-stories-wp/media').Resource} Resource
 */

/**
 * Get a resource from a URL.
 *
 * @param {ResourceLike} resourceLike Resource-like object.
 * @return {Promise<Resource>} Resource object.
 */
async function getResourceFromUrl(resourceLike) {
  const { src, mimeType, ...rest } = resourceLike;
  const type = getTypeFromMime(mimeType);

  if (!['image', 'video'].includes(type)) {
    throw new Error('Invalid media type.');
  }

  const isVideo = type === 'video';

  const getMediaDimensions = isVideo ? getVideoDimensions : getImageDimensions;
  const { width, height } = await getMediaDimensions(src);

  // Add necessary data for video.
  const videoData = {};
  if (isVideo) {
    const hasAudio = await hasVideoGotAudio(src);
    videoData.isMuted = !hasAudio;
    const { length, formattedLength } = await getVideoLength(src);
    videoData.length = length;
    videoData.formattedLength = formattedLength;
  }

  return createResource({
    type,
    width,
    height,
    src,
    local: false,
    isExternal: true,
    ...rest,
    ...videoData,
  });
}

export default getResourceFromUrl;
