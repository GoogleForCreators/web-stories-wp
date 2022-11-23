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
import { useCallback, useState } from '@googleforcreators/react';
import { withProtocol } from '@googleforcreators/url';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { getImageDimensions } from '@googleforcreators/media';
import useCORSProxy from '../../utils/useCORSProxy';
import useAPI from '../../app/api/useAPI';
import {
  getHotlinkDescription,
  isValidUrlForHotlinking,
  getErrorMessage,
  CORSMessage,
  checkImageDimensions,
} from './utils';

function useHotlinkModal({
  onSelect,
  onClose,
  onError,
  allowedFileTypes,
  canUseProxy,
  requiredImgDimensions,
}) {
  const [isInserting, setIsInserting] = useState(false);
  const [link, setLink] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    actions: { getHotlinkInfo },
  } = useAPI();

  const { checkResourceAccess, getProxiedUrl } = useCORSProxy();

  const isDisabled = errorMsg || !link || isInserting;
  const description = getHotlinkDescription(allowedFileTypes);

  const onBlur = useCallback(() => {
    if (link?.length > 0) {
      const newLink = withProtocol(link.trim());
      setLink(newLink);
      if (!isValidUrlForHotlinking(newLink)) {
        setErrorMsg(__('Invalid link.', 'web-stories'));
      }
    }
  }, [link, setErrorMsg, setLink]);

  const onChange = useCallback(
    ({ target: { value } }) => {
      // Always set the error to false when changing.
      if (errorMsg) {
        setErrorMsg(null);
      }
      setLink(value);
    },
    [errorMsg, setLink, setErrorMsg]
  );

  const onCloseDialog = useCallback(() => {
    onClose();
    setLink('');
    setErrorMsg(null);
    setIsInserting(false);
  }, [onClose]);

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
      if (!allowedFileTypes.includes(hotlinkInfo?.ext)) {
        setErrorMsg(__('Invalid link.', 'web-stories'));
        return;
      }

      const needsProxy = await checkResourceAccess(link);

      if (needsProxy && !canUseProxy) {
        setErrorMsg(<CORSMessage />);
        return;
      }

      if ('image' === hotlinkInfo?.type && requiredImgDimensions) {
        const proxiedUrl = needsProxy
          ? getProxiedUrl({ needsProxy }, link)
          : link;

        const dimensions = await getImageDimensions(proxiedUrl);
        const errorMessage = checkImageDimensions(
          dimensions.width,
          dimensions.height,
          requiredImgDimensions?.width,
          requiredImgDimensions?.height
        );
        if (errorMessage) {
          setErrorMsg(errorMessage);
          return;
        }

        hotlinkInfo.width = dimensions.width;
        hotlinkInfo.height = dimensions.height;
      }

      await onSelect({ link, hotlinkInfo, needsProxy });
      setLink('');
      setErrorMsg(null);
    } catch (err) {
      if (onError) {
        onError(err);
      }
      setErrorMsg(getErrorMessage(err.code, description));
    } finally {
      setIsInserting(false);
    }
  }, [
    link,
    getHotlinkInfo,
    allowedFileTypes,
    checkResourceAccess,
    canUseProxy,
    requiredImgDimensions,
    onSelect,
    getProxiedUrl,
    onError,
    description,
  ]);

  const onSubmit = useCallback(
    (evt) => {
      evt.preventDefault();

      if (!isDisabled) {
        onInsert();
      }
    },
    [isDisabled, onInsert]
  );

  return {
    action: {
      onChange,
      onSubmit,
      onBlur,
      onCloseDialog,
      onInsert,
    },
    state: {
      description,
      isInserting,
      link,
      errorMsg,
      isDisabled,
    },
  };
}
export default useHotlinkModal;
