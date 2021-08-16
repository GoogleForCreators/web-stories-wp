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
  getFileExtFromUrl,
  getFileNameFromUrl,
  getFirstFrameOfVideo,
  getImageDimensions,
  getVideoDimensions,
  getVideoLength,
  hasVideoGotAudio,
} from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import { useConfig } from '../../config';
import { getPosterName, useUploadVideoFrame } from '.';

function useGetResourceFromUrl() {
  const {
    allowedMimeTypes: { video, image },
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const { uploadVideoPoster } = useUploadVideoFrame({});

  const getResourceFromUrl = async (value) => {
    const ext = getFileExtFromUrl(value);
    let type = null;
    if (image.includes(`image/${ext}`)) {
      type = 'image';
    } else if (video.includes(`video/${ext}`)) {
      type = 'video';
    } else {
      return null;
    }
    const isVideo = type === 'video';
    const getMediaDimensions = isVideo
      ? getVideoDimensions
      : getImageDimensions;
    const { width, height } = await getMediaDimensions(value);

    // Add necessary data for video.
    let posterData;
    const videoData = {};
    const originalFileName = getFileNameFromUrl(value);
    if (isVideo) {
      // Create poster if possible.
      if (hasUploadMediaAction) {
        const fileName = getPosterName(originalFileName);
        const posterFile = await getFirstFrameOfVideo(value);
        posterData = await uploadVideoPoster(0, fileName, posterFile);
        videoData.poster = posterData.poster;
        videoData.posterId = posterData.posterId;
      }
      const hasAudio = await hasVideoGotAudio(value);
      videoData.isMuted = !hasAudio;
      const { length, formattedLength } = getVideoLength(value);
      videoData.length = length;
      videoData.formattedLength = formattedLength;
      videoData.isOptimized = true;
    }

    return createResource({
      alt: originalFileName,
      type,
      width,
      height,
      src: value,
      local: false,
      mimeType: `${type}/${ext}`,
      ...videoData,
    });
  };

  return getResourceFromUrl;
}

export default useGetResourceFromUrl;
