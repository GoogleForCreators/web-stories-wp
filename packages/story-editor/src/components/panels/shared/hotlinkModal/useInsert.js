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
import { __ } from '@googleforcreators/i18n';
import { trackError, trackEvent } from '@googleforcreators/tracking';
/**
 * Internal dependencies
 */
import {
  getErrorMessage,
  getHotlinkDescription,
  isValidUrlForHotlinking,
} from '../../../hotlinkModal';
import useCORSProxy from '../../../../utils/useCORSProxy';
import { useAPI } from '../../../../app/api';

function useInsert({ link, allowedFileTypes, setErrorMsg, onSelect }) {
  const [isInserting, setIsInserting] = useState(false);

  const {
    actions: { getHotlinkInfo },
  } = useAPI();

  const { checkResourceAccess } = useCORSProxy();

  const description = getHotlinkDescription(allowedFileTypes);

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
      const shouldProxy = await checkResourceAccess(link);

      await onSelect({
        mimeType: hotlinkInfo.mimeType,
        src: link,
        needsProxy: shouldProxy,
      });

      // After getting link metadata and before actual insertion
      // is a great opportunity to measure usage in a reasonably accurate way.
      trackEvent('hotlink_file', {
        event_label: link,
        file_size: hotlinkInfo.fileSize,
        file_type: hotlinkInfo.mimeType,
        needs_proxy: shouldProxy,
      });
    } catch (err) {
      trackError('hotlink_file', err?.message);

      setErrorMsg(getErrorMessage(err.code, description));
    } finally {
      setIsInserting(false);
    }
  }, [
    description,
    onSelect,
    link,
    getHotlinkInfo,
    setErrorMsg,
    checkResourceAccess,
  ]);

  return {
    onInsert,
    isInserting,
    setIsInserting,
  };
}
export default useInsert;
