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
import { __ } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
import { useState, useCallback } from '@googleforcreators/react';
import { trackError, trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import Dialog from '../../../hotlinkModal';

function HotlinkModal({
  isOpen,
  onClose,
  onSelect,
  allowedFileTypes = [],
  insertText = __('Insert', 'web-stories'),
  insertingText = __('Inserting…', 'web-stories'),
  title,
}) {
  const [link, setLink] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);

  const [isInserting, setIsInserting] = useState(false);

  const onError = useCallback((err) => {
    trackError('hotlink_file', err?.message);
    setIsInserting(false);
  }, []);

  const onInsert = useCallback(
    async (hotlinkInfo, shouldProxy) => {
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

      setIsInserting(false);
    },
    [link, onSelect]
  );

  return (
    <Dialog
      onClose={onClose}
      isOpen={isOpen}
      onInsert={onInsert}
      onError={onError}
      allowedFileTypes={allowedFileTypes}
      title={title}
      insertText={insertText}
      insertingText={insertingText}
      isInserting={isInserting}
      setIsInserting={setIsInserting}
      link={link}
      setLink={setLink}
      errorMsg={errorMsg}
      setErrorMsg={setErrorMsg}
    />
  );
}

HotlinkModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  allowedFileTypes: PropTypes.array,
  title: PropTypes.string,
  insertText: PropTypes.string,
  insertingText: PropTypes.string,
};

export default HotlinkModal;
