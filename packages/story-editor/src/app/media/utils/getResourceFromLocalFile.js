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
  createBlob,
  getTypeFromMime,
  getResourceSize,
  getFirstFrameOfVideo,
  createResource,
  getFileName,
  getImageDimensions,
  createFileReader,
  getVideoLength,
  hasVideoGotAudio,
} from '@web-stories-wp/media';

/**
 * Create a local resource object.
 *
 * @param {Object} properties The resource properties.
 * @return {import('@web-stories-wp/media').Resource} The local resource object.
 */
const createLocalResource = (properties) => {
  return createResource({ ...properties, local: true, isExternal: false });
};

/**
 * Generates a image resource object from a local File object.
 *
 * @param {File} file File object.
 * @return {Promise<import('@web-stories-wp/media').Resource>} Local image resource object.
 */
const getImageResource = async (file) => {
  const alt = getFileName(file);
  const mimeType = file.type;

  const reader = await createFileReader(file);

  const src = createBlob(new window.Blob([reader.result], { type: mimeType }));
  const { width, height } = await getImageDimensions(src);

  return createLocalResource({
    type: 'image',
    mimeType,
    src,
    ...getResourceSize({ width, height }),
    alt,
  });
};

/**
 * Generates a video resource object from a local File object.
 *
 * @param {File} file File object.
 * @return {Promise<import('@web-stories-wp/media').Resource>} Local video resource object.
 */
const getVideoResource = async (file) => {
  const alt = getFileName(file);
  const mimeType = file.type;

  let length = 0;
  let lengthFormatted = '';

  const reader = await createFileReader(file);

  const src = createBlob(new Blob([reader.result], { type: mimeType }));

  const videoEl = document.createElement('video');
  const canPlayVideo = '' !== videoEl.canPlayType(mimeType);
  if (canPlayVideo) {
    videoEl.src = src;
    const videoLength = await getVideoLength(src);
    length = videoLength.length;
    lengthFormatted = videoLength.lengthFormatted;
  }
  const posterFile = await getFirstFrameOfVideo(src);
  const hasAudio = await hasVideoGotAudio(src);
  const poster = createBlob(posterFile);
  const { width, height } = await getImageDimensions(poster);

  const resource = createLocalResource({
    type: 'video',
    mimeType,
    src: canPlayVideo ? src : '',
    ...getResourceSize({ width, height }),
    poster,
    isMuted: !hasAudio,
    length,
    lengthFormatted,
    alt,
  });

  return { resource, posterFile };
};

const createPlaceholderResource = (properties) => {
  return createLocalResource({ ...properties, isPlaceholder: true });
};

const getPlaceholderResource = (file) => {
  const alt = getFileName(file);
  const type = getTypeFromMime(file.type);
  const mimeType = type === 'image' ? 'image/png' : 'video/mp4';

  // The media library requires resources with valid mimeType and dimensions.
  return createPlaceholderResource({
    type: type || 'image',
    mimeType: mimeType,
    src: '',
    ...getResourceSize({}),
    alt,
  });
};

/**
 * Generates a resource object from a local File object.
 *
 * @param {File} file File object.
 * @return {Promise<Object<{resource: import('@web-stories-wp/media').Resource, posterFile: File}>>} Object containing resource object and poster file.
 */
const getResourceFromLocalFile = async (file) => {
  const type = getTypeFromMime(file.type);

  let resource = getPlaceholderResource(file);
  let posterFile = null;

  try {
    if ('image' === type) {
      resource = await getImageResource(file);
    }

    if ('video' === type) {
      const results = await getVideoResource(file);
      resource = results.resource;
      posterFile = results.posterFile;
    }
  } catch {
    // Not interested in the error here.
  }

  return { resource, posterFile };
};

export default getResourceFromLocalFile;
