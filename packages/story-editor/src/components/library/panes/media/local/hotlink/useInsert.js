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
import { useCallback } from 'react';
import { __ } from '@web-stories-wp/i18n';
import {
  createResource,
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
import {
  getPosterName,
  useUploadVideoFrame,
} from '../../../../../../app/media/utils';
import { isValidUrl } from '../../../../../../utils/url';
import useLibrary from '../../../../useLibrary';
import { useConfig } from '../../../../../../app';

function useInsert({
  link,
  setLink,
  errorMsg,
  setErrorMsg,
  getFileInfo,
  onClose,
}) {
  const { uploadVideoPoster } = useUploadVideoFrame({});
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));
  const onInsert = useCallback(async () => {
    if (errorMsg?.length) {
      return;
    }
    const insertionError = __(
      'Media failed to load. Please ensure the link is valid and the site allows linking from external sites',
      'web-stories'
    );
    if (!isValidUrl(link)) {
      setErrorMsg(insertionError);
      return;
    }
    try {
      const { type } = getFileInfo();
      const isVideo = type === 'video';
      const getMediaDimensions = isVideo
        ? getVideoDimensions
        : getImageDimensions;
      const { width, height } = await getMediaDimensions(link);

      // Add necessary data for video.
      let posterData;
      const videoData = {};
      const originalFileName = getFileNameFromUrl(link);
      if (isVideo) {
        // Create poster if possible.
        if (hasUploadMediaAction) {
          const fileName = getPosterName(originalFileName);
          const posterFile = await getFirstFrameOfVideo(link);
          posterData = await uploadVideoPoster(0, fileName, posterFile);
          videoData.poster = posterData.poster;
          videoData.posterId = posterData.posterId;
        }
        const hasAudio = await hasVideoGotAudio(link);
        videoData.isMuted = !hasAudio;
        const { length, formattedLength } = getVideoLength(link);
        videoData.length = length;
        videoData.formattedLength = formattedLength;
      }
      // @todo Create getResourceFromUrl util instead.
      insertElement(type, {
        resource: createResource({
          alt: originalFileName,
          type,
          width,
          height,
          src: link,
          local: false,
          ...videoData,
        }),
      });
      setErrorMsg(null);
      setLink('');
      onClose();
    } catch (e) {
      setErrorMsg(insertionError);
    }
  }, [
    insertElement,
    link,
    errorMsg,
    getFileInfo,
    onClose,
    uploadVideoPoster,
    hasUploadMediaAction,
    setErrorMsg,
    setLink,
  ]);
  return onInsert;
}

export default useInsert;
