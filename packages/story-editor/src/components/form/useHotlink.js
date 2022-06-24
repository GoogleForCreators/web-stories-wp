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
import useCORSProxy from '../../utils/useCORSProxy';

function useHotlink({ onChange, type, canUseProxy }) {
  const [isOpen, setIsOpen] = useState(false);

  const openHotlink = () => setIsOpen(true);
  const onCloseHotlink = () => setIsOpen(false);
  const allowedFileTypes = useMemo(
    () =>
      Array.isArray(type)
        ? type.map((_type) => getExtensionsFromMimeType(_type)).flat()
        : [],
    [type]
  );

  const { getProxiedUrl } = useCORSProxy();

  const onSelect = useCallback(
    async ({ link, hotlinkInfo, needsProxy }) => {
      const { mimeType, fileName: originalFileName } = hotlinkInfo;

      const proxiedUrl =
        needsProxy && canUseProxy ? getProxiedUrl({ needsProxy }, link) : link;

      const resourceLike = {
        id: uuidv4(),
        src: proxiedUrl,
        mimeType,
        needsProxy,
        alt: originalFileName,
      };

      const resource = await getResourceFromUrl(resourceLike);
      resource.src = link;
      onChange(resource);

      setIsOpen(false);
    },
    [canUseProxy, getProxiedUrl, onChange]
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
    },
  };
}

export default useHotlink;
