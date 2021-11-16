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
import { useCallback, useState } from '@web-stories-wp/react';
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';
import {
  getImageFromVideo,
  preloadVideoMetadata,
  getVideoLengthDisplay,
} from '@web-stories-wp/media';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import useStory from '../../../../../../app/story/useStory';
import useLibrary from '../../../../useLibrary';
import getResourceFromUrl from '../../../../../../app/media/utils/getResourceFromUrl';
import {
  getPosterName,
  useUploadVideoFrame,
} from '../../../../../../app/media/utils';
import { useConfig } from '../../../../../../app/config';
import { useAPI } from '../../../../../../app/api';
import useCORSProxy from '../../../../../../utils/useCORSProxy';
import { isValidUrlForHotlinking } from './utils';

function getErrorMessage(code, description) {
  switch (code) {
    case 'rest_invalid_param':
    case 'rest_invalid_url':
      return __('Invalid link.', 'web-stories');
    case 'rest_invalid_ext':
      return sprintf(
        /* translators: %s is the description with allowed file extensions. */
        __('Invalid link. %s', 'web-stories'),
        description
      );
    default:
      return __(
        'Media failed to load. Please ensure the link is valid and the site allows linking from external sites.',
        'web-stories'
      );
  }
}

function seekVideo(video) {
  video.preload = 'auto';

  return new Promise((resolve, reject) => {
    video.addEventListener('error', reject);
    video.addEventListener(
      'canplay',
      () => {
        video.currentTime = 0.99;
      },
      { once: true } // Important because 'canplay' can be fired hundreds of times.
    );

    video.addEventListener('seeked', () => resolve(video), { once: true });
  });
}

function useInsert({ link, setLink, setErrorMsg, onClose }) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));
  const {
    capabilities: { hasUploadMediaAction },
    allowedFileTypes,
  } = useConfig();
  const {
    actions: { getHotlinkInfo },
  } = useAPI();
  const { updateElementsByResourceId } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
  }));

  const [isInserting, setIsInserting] = useState(false);

  const { uploadVideoPoster } = useUploadVideoFrame({});
  const { getProxiedUrl } = useCORSProxy();

  const insertMedia = useCallback(
    async (hotlinkData, needsProxy) => {
      const {
        ext,
        type,
        mime_type: mimeType,
        file_name: originalFileName,
      } = hotlinkData;

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

        let video;

        // We need to gather some metadata for videos, but do it efficiently
        // by only loading it once, speeding up insertion.
        if (isVideo) {
          video = await preloadVideoMetadata(proxiedUrl);

          resourceLike.width = video.videoWidth;
          resourceLike.height = video.videoHeight;

          resourceLike.length = Math.round(video.duration);
          resourceLike.lengthFormatted = getVideoLengthDisplay(
            resourceLike.length
          );

          resourceLike.isMuted = !(
            video.mozHasAudio ||
            Boolean(video.webkitAudioDecodedByteCount) ||
            Boolean(video.audioTracks?.length)
          );
        }

        // Passing the potentially proxied URL here just so that
        // metadata retrieval works as expected (if still needed after the above).
        // Afterwards, overriding `src` again to ensure we store the original URL.
        const resource = await getResourceFromUrl(resourceLike);
        resource.src = link;

        insertElement(type, {
          resource,
        });

        setIsInserting(false);
        setErrorMsg(null);
        setLink('');
        onClose();

        // We still want to auto-generate and *upload* video posters,
        // even for hotlinked videos.
        // This can easily be done after actual insertion though, as it might fail.
        // Thus adding this nested try ... catch.
        if (isVideo && hasUploadMediaAction) {
          try {
            const fileName = getPosterName(
              originalFileName.replace(`.${ext}`, '')
            );
            video = await seekVideo(video);
            const posterFile = await getImageFromVideo(video);
            const posterData = await uploadVideoPoster(0, fileName, posterFile);

            updateElementsByResourceId({
              id: resource.id,
              properties: (existingResource) => {
                return {
                  resource: {
                    ...existingResource.resource,
                    poster: posterData.poster,
                    posterId: posterData.posterId,
                  },
                };
              },
            });
          } catch {
            // No need to catch poster generation errors.
          }
        }
      } catch (e) {
        setErrorMsg(getErrorMessage());
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
      updateElementsByResourceId,
    ]
  );

  /**
   * Check if the resource can be accessed directly.
   *
   * Makes a HEAD request, which in turn triggers a CORS preflight request
   * in the browser.
   *
   * If the request passes, we don't need to do anything.
   * If it doesn't, it means we need to run the resource through our CORS proxy at all times.
   *
   * @type {function(): boolean}
   */
  const checkResourceAccess = useCallback(async () => {
    let shouldProxy = false;
    try {
      await fetch(link, {
        method: 'HEAD',
      });
    } catch (err) {
      shouldProxy = true;
    }

    return shouldProxy;
  }, [link]);

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
      const hotlinkInfo = await getHotlinkInfo(link);
      const shouldProxy = await checkResourceAccess();

      await insertMedia(hotlinkInfo, shouldProxy);
    } catch (err) {
      setIsInserting(false);

      let description = __(
        'No file types are currently supported.',
        'web-stories'
      );
      if (allowedFileTypes.length) {
        description = sprintf(
          /* translators: %s is a list of allowed file extensions. */
          __('You can insert %s.', 'web-stories'),
          translateToExclusiveList(allowedFileTypes)
        );
      }
      setErrorMsg(getErrorMessage(err.code, description));
    }
  }, [
    allowedFileTypes,
    link,
    getHotlinkInfo,
    setErrorMsg,
    insertMedia,
    checkResourceAccess,
  ]);

  return {
    onInsert,
    isInserting,
  };
}

export default useInsert;
