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
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';
import { Input } from '@web-stories-wp/design-system';
import {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from '@web-stories-wp/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../../../app';
import Dialog from '../../../../../dialog';
import { isValidUrl, withProtocol } from '../../../../../../utils/url';
import useInsert from './useInsert';

const InputWrapper = styled.div`
  margin: 16px 4px;
  width: 470px;
  height: 100px;
`;

function HotlinkModal({ isOpen, onClose }) {
  const { allowedFileTypes } = useConfig();
  const [errorMsg, setErrorMsg] = useState(false);
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    // Wait one tick to ensure the input has been loaded.
    const timeout = setTimeout(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    });
    return () => clearTimeout(timeout);
  }, [isOpen, inputRef]);

  let description = __('No file types are currently supported.', 'web-stories');
  if (allowedFileTypes.length) {
    description = sprintf(
      /* translators: %s is a list of allowed file extensions. */
      __('You can insert %s.', 'web-stories'),
      translateToExclusiveList(allowedFileTypes)
    );
  }
  const [link, setLink] = useState('');

  const onInsert = useInsert({
    link,
    setLink,
    errorMsg,
    setErrorMsg,
    onClose,
  });

  const onBlur = useCallback(() => {
    if (link?.length > 0) {
      setLink(withProtocol(link));
      if (!isValidUrl(link)) {
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

  return (
    <Dialog
      onClose={() => {
        onClose();
        setLink('');
        setErrorMsg(false);
      }}
      isOpen={isOpen}
      title={__('Insert external image or video', 'web-stories')}
      onPrimary={() => onInsert()}
      primaryText={__('Insert', 'web-stories')}
      secondaryText={__('Cancel', 'web-stories')}
      primaryRest={{ disabled: Boolean(errorMsg?.length) || !link }}
    >
      <InputWrapper>
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
};

export default HotlinkModal;
