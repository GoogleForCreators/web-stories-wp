/*
 * Copyright 2022 Google LLC
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
import { useCallback, useMemo, useState } from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import { getExtensionsFromMimeType } from '@googleforcreators/media';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import getResourceFromUrl from '../../app/media/utils/getResourceFromUrl';

function useHotlink({ onChange, cropParams, type }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultErrorMsg, setDefaultErrorMsg] = useState(null);

  const openHotlink = () => setIsOpen(true);
  const onCloseHotlink = () => {
    setIsOpen(false);
    setDefaultErrorMsg(null);
  };
  const allowedFileTypes = useMemo(
    () =>
      Array.isArray(type)
        ? type.map((_type) => getExtensionsFromMimeType(_type)).flat()
        : [],
    [type]
  );

  const onSelect = useCallback(
    async ({ link, hotlinkInfo, needsProxy }) => {
      const { mimeType, fileName: originalFileName } = hotlinkInfo;

      const resourceLike = {
        id: uuidv4(),
        src: link,
        mimeType,
        needsProxy,
        alt: originalFileName,
      };

      const resource = await getResourceFromUrl(resourceLike);

      if (cropParams?.height && cropParams?.height !== resource?.height) {
        setDefaultErrorMsg(
          sprintf(
            /* translators: 1: supplied height. 2: desired height */
            __(
              'Invalid image height supplied %1$d when %2$d is required.',
              'web-stories'
            ),
            resource.height,
            cropParams.height
          )
        );
        return;
      }

      if (cropParams?.width && cropParams?.width !== resource?.width) {
        setDefaultErrorMsg(
          sprintf(
            /* translators: 1: supplied width. 2: desired width */
            __(
              'Invalid image width supplied %1$d when %2$d is required.',
              'web-stories'
            ),
            resource.width,
            cropParams?.width
          )
        );
        return;
      }

      onChange(resource);

      setIsOpen(false);
    },
    [cropParams, onChange]
  );

  return {
    actions: {
      onSelect,
      openHotlink,
      onCloseHotlink,
    },
    state: {
      allowedFileTypes,
      isOpen,
      defaultErrorMsg,
    },
  };
}

export default useHotlink;
