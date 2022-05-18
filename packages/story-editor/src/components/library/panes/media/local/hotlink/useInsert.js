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
import { useCallback, useState, useMemo } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  getImageFromVideo,
  seekVideo,
  getVideoLength,
  preloadVideo,
  hasVideoGotAudio,
  getExtensionsFromMimeType,
} from '@googleforcreators/media';
import { v4 as uuidv4 } from 'uuid';
import { trackError, trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import useLibrary from '../../../../useLibrary';
import getResourceFromUrl from '../../../../../../app/media/utils/getResourceFromUrl';
import {
  getPosterName,
  useUploadVideoFrame,
} from '../../../../../../app/media/utils';
import { useConfig } from '../../../../../../app/config';
import useCORSProxy from '../../../../../../utils/useCORSProxy';
import useDetectBaseColor from '../../../../../../app/media/utils/useDetectBaseColor';
import {
  isValidUrlForHotlinking,
  getErrorMessage,
  getHotlinkDescription,
  useGetHotlinkData,
} from '../../../../../hotlinkModal';

function useInsert({ link, setLink, setErrorMsg, onClose }) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));
  const {
    capabilities: { hasUploadMediaAction },
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      vector: allowedVectorMimeTypes,
      video: allowedVideoMimeTypes,
    },
  } = useConfig();

  const allowedMimeTypes = useMemo(
    () => [
      ...allowedImageMimeTypes,
      ...allowedVectorMimeTypes,
      ...allowedVideoMimeTypes,
    ],
    [allowedImageMimeTypes, allowedVectorMimeTypes, allowedVideoMimeTypes]
  );
  const allowedFileTypes = useMemo(
    () =>
      allowedMimeTypes.map((type) => getExtensionsFromMimeType(type)).flat(),
    [allowedMimeTypes]
  );

  const description = getHotlinkDescription(allowedFileTypes);
  const { getHotlinkData } = useGetHotlinkData();
  const { updateBaseColor } = useDetectBaseColor({});

  const [isInserting, setIsInserting] = useState(false);

  const { uploadVideoPoster } = useUploadVideoFrame({});
  const { getProxiedUrl } = useCORSProxy();

  const insertMedia = useCallback(
    async (hotlinkData, needsProxy) => {
      const { ext, type, mimeType, fileName: originalFileName } = hotlinkData;

      const isVideo = type === 'video';

      try {
        const proxiedUrl = needsProxy
          ? getProxiedUrl({ needsProxy }, link)
          : link;

        const resourceLike = {
          id: uuidv4(),
          src: proxiedUrl,
          mimeType,
          needsProxy,
          alt: originalFileName,
        };

        // We need to gather some metadata for videos, but efficiently.
        // Thus only loading it once to speed up insertion.
        if (isVideo) {
          // preloadVideoMetadata would suffice, except for audio detection
          // which requires loading more than just metadata.
          const video = await preloadVideo(proxiedUrl);
          await seekVideo(video);

          resourceLike.width = video.videoWidth;
          resourceLike.height = video.videoHeight;

          const videoLength = getVideoLength(video);

          resourceLike.length = videoLength.length;
          resourceLike.lengthFormatted = videoLength.lengthFormatted;

          resourceLike.isMuted = !hasVideoGotAudio(video);

          // We want to auto-generate and *upload* posters for hotlinked videos.
          // While this could be done _after_ insertion, at this point we have
          // already preloaded the video, so this will be quick.
          // Also, this avoids adding a history entry for adding the poster,
          // which would also cause the autoplayed video to be paused again.
          // However, upload might fail, thus adding this nested try ... catch.
          if (hasUploadMediaAction) {
            try {
              const fileName = getPosterName(
                originalFileName.replace(`.${ext}`, '')
              );

              const posterFile = await getImageFromVideo(video);
              const posterData = await uploadVideoPoster(
                0,
                fileName,
                posterFile
              );

              resourceLike.poster = posterData.poster;
              resourceLike.posterId = posterData.posterId;
            } catch {
              // No need to catch poster generation errors.
            }
          }
        }

        // Passing the potentially proxied URL here just so that
        // metadata retrieval works as expected (if still needed after the above).
        // Afterwards, overriding `src` again to ensure we store the original URL.
        const resource = await getResourceFromUrl(resourceLike);
        resource.src = link;

        insertElement(type, {
          resource,
        });

        updateBaseColor(resource);

        setErrorMsg(false);
        setLink('');
        onClose();
      } catch (e) {
        setErrorMsg(getErrorMessage());
      } finally {
        setIsInserting(false);
      }
    },
    [
      hasUploadMediaAction,
      insertElement,
      link,
      onClose,
      setErrorMsg,
      setLink,
      uploadVideoPoster,
      getProxiedUrl,
      updateBaseColor,
    ]
  );

  const onInsert = useCallback(async () => {
    if (!link) {
      return;
    }

    if (!isValidUrlForHotlinking(link)) {
      setErrorMsg(__('Invalid link.', 'web-stories'));
      return;
    }

    setIsInserting(true);

    try {
      const { hotlinkInfo, shouldProxy } = await getHotlinkData(link);

      // After getting link metadata and before actual insertion
      // is a great opportunity to measure usage in a reasonably accurate way.
      trackEvent('hotlink_media', {
        event_label: link,
        file_size: hotlinkInfo.fileSize,
        file_type: hotlinkInfo.mimeType,
        needs_proxy: shouldProxy,
      });

      await insertMedia(hotlinkInfo, shouldProxy);
    } catch (err) {
      setIsInserting(false);

      trackError('hotlink_media', err?.message);

      setErrorMsg(getErrorMessage(err.code, description));
    }
  }, [link, setErrorMsg, getHotlinkData, insertMedia, description]);

  return {
    onInsert,
    isInserting,
    setIsInserting,
    allowedFileTypes,
  };
}

export default useInsert;
