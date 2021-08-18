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
import { useCallback } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import {
  getFileExtFromUrl,
  getFileNameFromUrl,
  getFirstFrameOfVideo,
} from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import { isValidUrl } from '../../../../../../utils/url';
import useLibrary from '../../../../useLibrary';
import getResourceFromUrl from '../../../../../../app/media/utils/getResourceFromUrl';
import {
  getPosterName,
  useUploadVideoFrame,
} from '../../../../../../app/media/utils';
import { useConfig } from '../../../../../../app/config';

// @todo Get the mime type from server-side validation instead.
const EXT_MIME_TYPES = {
  jpg: 'image/jpeg',
  gif: 'image/gif',
  jpe: 'image/jpe',
  jpeg: 'image/jpg',
  m4v: 'video/mp4',
  mp4: 'video/mp4',
  png: 'image/png',
  webm: 'video/webm',
  webp: 'image/webp',
};

function useInsert({
  link,
  setLink,
  errorMsg,
  setErrorMsg,
  getFileInfo,
  onClose,
}) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const { uploadVideoPoster } = useUploadVideoFrame({});
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
      const resource = await getResourceFromUrl(link, type);

      // @todo Get the mime type from server-side validation instead.
      const ext = getFileExtFromUrl(link);
      resource.mimeType = EXT_MIME_TYPES[ext];

      if ('video' === type && hasUploadMediaAction) {
        const originalFileName = getFileNameFromUrl(link);
        const fileName = getPosterName(originalFileName);
        const posterFile = await getFirstFrameOfVideo(link);
        const posterData = await uploadVideoPoster(0, fileName, posterFile);
        resource.poster = posterData.poster;
        resource.posterId = posterData.posterId;
      }
      insertElement(type, {
        resource,
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
    setErrorMsg,
    setLink,
    hasUploadMediaAction,
    uploadVideoPoster,
  ]);
  return onInsert;
}

export default useInsert;
