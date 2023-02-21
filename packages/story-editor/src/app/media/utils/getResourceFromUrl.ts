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
  getVideoLength,
  hasVideoGotAudio,
  preloadVideo,
  seekVideo,
  ResourceType,
  type Resource,
  type VideoResource,
} from '@googleforcreators/media';

type ResourceLike = Pick<
  Resource,
  'id' | 'src' | 'mimeType' | 'needsProxy' | 'alt'
> &
  Partial<Resource> &
  Partial<VideoResource>;

/**
 * Get a resource from a URL.
 *
 * @param resourceLike Resource-like object.
 * @return Resource object.
 */
async function getResourceFromUrl(resourceLike: ResourceLike) {
  const {
    src,
    mimeType,
    width = 0,
    height = 0,
    isMuted,
    length,
    lengthFormatted,
    ...rest
  } = resourceLike;
  const type = getTypeFromMime(mimeType);

  if (![ResourceType.Image, ResourceType.Video].includes(type)) {
    throw new Error('Invalid media type.');
  }

  const hasDimensions = Boolean(width && height);
  const videoHasMissingMetadata =
    !hasDimensions ||
    isMuted === null ||
    length === null ||
    lengthFormatted === null;

  const additionalData: Partial<VideoResource> = {};

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
