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
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';
import { Input } from '@googleforcreators/design-system';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  useCallback,
  useRef,
  useState,
  useLayoutEffect,
} from '@googleforcreators/react';
import { trackError, trackEvent } from '@googleforcreators/tracking';
import { withProtocol } from '@googleforcreators/url';
/**
 * Internal dependencies
 */
import Dialog from '../../dialog';
import {
  isValidUrlForHotlinking,
  getErrorMessage,
} from '../../library/panes/media/local/hotlink/utils';
import { useAPI } from '../../../app/api';
import useCORSProxy from '../../../utils/useCORSProxy';

const InputWrapper = styled.form`
  margin: 16px 4px;
  width: 470px;
  height: 100px;
`;

function HotlinkModal({
  isOpen,
  onClose,
  onSelect,
  allowedFileTypes = [],
  insertText = __('Insert', 'web-stories'),
  insertingText = __('Inserting…', 'web-stories'),
  title,
}) {
  const [isInserting, setIsInserting] = useState(false);
  const [link, setLink] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const inputRef = useRef(null);

  const {
    actions: { getHotlinkInfo },
  } = useAPI();

  const { checkResourceAccess } = useCORSProxy();

  const isDisabled = errorMsg || !link || isInserting;
  const primaryText = isInserting ? insertingText : insertText;

  let description = __('No file types are currently supported.', 'web-stories');
  if (allowedFileTypes.length) {
    description = sprintf(
      /* translators: %s is a list of allowed file extensions. */
      __('You can insert %s.', 'web-stories'),
      translateToExclusiveList(allowedFileTypes)
    );
  }

  useLayoutEffect(() => {
    // Wait one tick to ensure the input has been loaded.
    const timeout = setTimeout(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    });
    return () => clearTimeout(timeout);
  }, [isOpen, inputRef]);

  const onBlur = useCallback(() => {
    if (link?.length > 0) {
      const newLink = withProtocol(link);
      setLink(newLink);
      if (!isValidUrlForHotlinking(newLink)) {
        setErrorMsg(__('Invalid link.', 'web-stories'));
      }
    }
  }, [link]);

  const onChange = useCallback(
    (value) => {
      // Always set the error to null when changing.
      if (errorMsg) {
        setErrorMsg(null);
      }
      setLink(value);
    },
    [setLink, errorMsg]
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
      const hotlinkInfo = await getHotlinkInfo(link);
      const shouldProxy = await checkResourceAccess(link);

      // After getting link metadata and before actual insertion
      // is a great opportunity to measure usage in a reasonably accurate way.
      trackEvent('hotlink_file', {
        event_label: link,
        file_size: hotlinkInfo.fileSize,
        file_type: hotlinkInfo.mimeType,
        needs_proxy: shouldProxy,
      });

      onSelect({
        mimeType: hotlinkInfo.mimeType,
        src: link,
        needsProxy: shouldProxy,
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

  const onSubmit = useCallback(
    (evt) => {
      evt.preventDefault();

      if (!isDisabled) {
        onInsert();
      }
    },
    [isDisabled, onInsert]
  );

  return (
    <Dialog
      onClose={() => {
        onClose();
        setLink('');
        setErrorMsg(false);
        setIsInserting(false);
      }}
      isOpen={isOpen}
      title={title}
      onPrimary={() => onInsert()}
      primaryText={primaryText}
      secondaryText={__('Cancel', 'web-stories')}
      primaryRest={{ disabled: isDisabled }}
    >
      <InputWrapper onSubmit={onSubmit}>
        <Input
          ref={inputRef}
          onChange={({ target: { value } }) => onChange(value)}
          value={link}
          hint={errorMsg?.length ? errorMsg : description}
          hasError={Boolean(errorMsg?.length)}
          onBlur={onBlur}
          label={__('URL', 'web-stories')}
          type="url"
          required
        />
      </InputWrapper>
    </Dialog>
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
