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
  createResource,
  getFileBasename,
  getImageDimensions,
  createFileReader,
  getVideoLength,
  hasVideoGotAudio,
  getImageFromVideo,
  seekVideo,
  preloadVideo,
  blobToFile,
  ResourceInput,
  Resource,
} from '@googleforcreators/media';
import { v4 as uuidv4 } from 'uuid';

export enum ResourceType {
  Image = 'image',
  Video = 'video',
  Gif = 'gif',
  Audio = 'audio',
}

/**
 * Internal dependencies
 */
import { MEDIA_POSTER_IMAGE_MIME_TYPE } from '../../../constants';
import getPosterName from './getPosterName';

/**
 * Generates a image resource object from a local File object.
 *
 * @param {File} file File object.
 * @return {Promise<import('@googleforcreators/media').Resource>} Local image resource object.
 */
const getImageResource = async (file: File): Promise<Resource | null> => {
  const alt = getFileBasename(file);
  const mimeType = file.type;

  const reader: FileReader = await createFileReader(file);

  if (!reader.result) {
    return null;
  }

  const src = createBlob(new window.Blob([reader.result], { type: mimeType }));
  const { width, height } = await getImageDimensions(src);

  return createResource({
    type: ResourceType.Image,
    mimeType,
    src,
    ...getResourceSize({ width, height }),
    alt,
  } as ResourceInput);
};

/**
 * Generates a video resource object from a local File object.
 *
 * @param {File} file File object.
 * @return {Promise<import('@googleforcreators/media').Resource>} Local video resource object.
 */
const getVideoResource = async (file: File): Promise<Resource | null> => {
  const alt = getFileBasename(file);
  const mimeType = file.type;

  const reader = await createFileReader(file);

  if (!reader.result) {
    return null;
  }

  const src = createBlob(new Blob([reader.result], { type: mimeType }));

  // Here we are potentially dealing with an unsupported file type (e.g. MOV)
  // that cannot be *played* by the browser, but could still be used for generating a poster.

  const videoEl = await preloadVideo(src);
  if (!videoEl) {
    return null;
  }

  const canPlayVideo = '' !== videoEl.canPlayType(mimeType);

  const { length, lengthFormatted } = getVideoLength(videoEl);

  await seekVideo(videoEl);
  const hasAudio = hasVideoGotAudio(videoEl);

  const posterFile = blobToFile(
    await getImageFromVideo(videoEl),
    getPosterName(getFileBasename(file)),
    MEDIA_POSTER_IMAGE_MIME_TYPE
  );
  const poster = createBlob(posterFile);
  const { width, height } = await getImageDimensions(poster);

  const resource = createResource({
    type: ResourceType.Video,
    mimeType,
    src: canPlayVideo ? src : '',
    ...getResourceSize({ width, height }),
    poster,
    isMuted: !hasAudio,
    length,
    lengthFormatted,
    alt,
  } as ResourceInput);

  return { resource, posterFile };
};

const createPlaceholderResource = (properties) => {
  return createResource({ ...properties, isPlaceholder: true });
};

const getPlaceholderResource = (file) => {
  const alt = getFileBasename(file);
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
 * @return {Promise<Object<{resource: import('@googleforcreators/media').Resource, posterFile: File}>>} Object containing resource object and poster file.
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
    // We simply fall back to the placeholder resource.
  }

  resource.id = uuidv4();

  return { resource, posterFile };
};

export default getResourceFromLocalFile;
