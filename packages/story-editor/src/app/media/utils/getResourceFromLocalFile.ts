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
  blobToFile,
  createBlob,
  createFileReader,
  createResource,
  getFileBasename,
  getImageDimensions,
  getImageFromVideo,
  getResourceSize,
  getTypeFromMime,
  getVideoLength,
  hasVideoGotAudio,
  preloadVideo,
  seekVideo,
  ResourceType,
  type ResourceInput,
  type ImageResource,
  type VideoResource,
} from '@googleforcreators/media';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { MEDIA_POSTER_IMAGE_MIME_TYPE } from '../../../constants';
import getPosterName from './getPosterName';

/**
 * Generates a image resource object from a local File object.
 *
 * @param file File object.
 * @return Local image resource object.
 */
async function getImageResource(file: File): Promise<ImageResource | null> {
  const reader: FileReader = await createFileReader(file);

  if (!reader.result) {
    return null;
  }

  const mimeType = file.type;

  const src = createBlob(new window.Blob([reader.result], { type: mimeType }));
  const { width, height } = await getImageDimensions(src);

  const alt = getFileBasename(file);

  return createResource({
    type: ResourceType.Image,
    mimeType,
    src,
    ...getResourceSize({ width, height }),
    alt,
  } as ResourceInput) as ImageResource;
}

/**
 * Generates a video resource object from a local File object.
 *
 * @param file File object.
 * @return Local video resource object.
 */
async function getVideoResource(
  file: File
): Promise<{ resource: VideoResource; posterFile: File | null } | null> {
  const reader = await createFileReader(file);

  if (!reader.result) {
    return null;
  }

  const mimeType = file.type;

  const src = createBlob(new Blob([reader.result], { type: mimeType }));

  // Here we are potentially dealing with an unsupported file type (e.g. MOV)
  // that cannot be *played* by the browser, but could still be used for generating a poster.

  const videoEl = await preloadVideo(src);

  const canPlayVideo = '' !== videoEl.canPlayType(mimeType);

  const { length, lengthFormatted } = getVideoLength(videoEl);

  await seekVideo(videoEl);
  const hasAudio = videoEl && hasVideoGotAudio(videoEl);

  const posterBlob = videoEl ? await getImageFromVideo(videoEl) : null;
  const posterFile =
    posterBlob &&
    blobToFile(
      posterBlob,
      getPosterName(getFileBasename(file)),
      MEDIA_POSTER_IMAGE_MIME_TYPE
    );
  const poster = posterFile ? createBlob(posterFile) : undefined;
  const { width, height } = poster
    ? await getImageDimensions(poster)
    : { width: undefined, height: undefined };

  const alt = getFileBasename(file);

  const resource = createResource({
    id: uuidv4(),
    type: ResourceType.Video,
    mimeType,
    src: canPlayVideo ? src : '',
    ...getResourceSize({ width, height }),
    poster,
    isMuted: !hasAudio,
    length,
    lengthFormatted,
    alt,
  }) as VideoResource;

  return { resource, posterFile };
}

const createPlaceholderResource = (properties: ResourceInput) => {
  return createResource({ ...properties, isPlaceholder: true });
};

const getPlaceholderResource = (file: File) => {
  const alt = getFileBasename(file);
  const type = getTypeFromMime(file.type);
  const mimeType = type === ResourceType.Image ? 'image/png' : 'video/mp4';

  // The media library requires resources with valid mimeType and dimensions.
  return createPlaceholderResource({
    id: uuidv4(),
    type: type || ResourceType.Image,
    mimeType: mimeType,
    src: '',
    ...getResourceSize({}),
    alt,
  });
};

/**
 * Generates a resource object from a local File object.
 *
 * @param file File object.
 * @return Object containing resource object and poster file.
 */
async function getResourceFromLocalFile(file: File) {
  const type = getTypeFromMime(file.type);

  const fallbackResource = getPlaceholderResource(file);
  let resource;
  let posterFile = null;

  try {
    if (ResourceType.Image === type) {
      resource = await getImageResource(file);
    }

    if (ResourceType.Video === type) {
      const results = await getVideoResource(file);
      if (results) {
        resource = results.resource;
        posterFile = results.posterFile;
      }
    }
  } catch {
    // Not interested in the error here.
    // We simply fall back to the placeholder resource.
  }

  resource ||= fallbackResource;

  resource.id = uuidv4();

  return { resource, posterFile };
}

export default getResourceFromLocalFile;
