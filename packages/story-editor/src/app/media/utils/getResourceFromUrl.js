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
} from '@web-stories-wp/media';

async function getResourceFromUrl(value, type, needsProxy) {
  const isVideo = type === 'video';
  const isImage = type === 'image';
  if (!isVideo && !isImage) {
    throw new Error('Invalid media type.');
  }
  const getMediaDimensions = isVideo ? getVideoDimensions : getImageDimensions;
  const { width, height } = await getMediaDimensions(value);

  // Add necessary data for video.
  const videoData = {};
  if (isVideo) {
    const hasAudio = await hasVideoGotAudio(value);
    videoData.isMuted = !hasAudio;
    const { length, formattedLength } = await getVideoLength(value);
    videoData.length = length;
    videoData.formattedLength = formattedLength;
    videoData.isOptimized = true;
  }

  return createResource({
    type,
    width,
    height,
    src: value,
    local: false,
    isExternal: true,
    needsProxy,
    ...videoData,
  });
}

export default getResourceFromUrl;
