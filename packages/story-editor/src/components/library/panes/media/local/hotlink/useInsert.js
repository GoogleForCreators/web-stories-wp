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
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';
import { getFirstFrameOfVideo } from '@web-stories-wp/media';

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
import { useAPI } from '../../../../../../app/api';
import useCORSProxy from '../../../../../../utils/useCORSProxy';

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

      try {
        const proxiedUrl = getProxiedUrl({ needsProxy }, link);
        const resource = await getResourceFromUrl(proxiedUrl, type, needsProxy);
        resource.alt = originalFileName;
        resource.src = link;
        resource.mimeType = mimeType;
        if ('video' === type && hasUploadMediaAction) {
          // Remove the extension from the filename for poster.
          const fileName = getPosterName(
            originalFileName.replace(`.${ext}`, '')
          );
          const posterFile = await getFirstFrameOfVideo(proxiedUrl);
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

  return useCallback(async () => {
    if (!link) {
      return;
    }
    if (!isValidUrl(link)) {
      setErrorMsg(__('Invalid link.', 'web-stories'));
      return;
    }

    try {
      const hotlinkInfo = await getHotlinkInfo(link);
      const shouldProxy = await checkResourceAccess();

      await insertMedia(hotlinkInfo, shouldProxy);
    } catch (err) {
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
}

export default useInsert;
