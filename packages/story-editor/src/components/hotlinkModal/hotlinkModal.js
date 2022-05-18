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
import { Input } from '@googleforcreators/design-system';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useCallback, useRef, useLayoutEffect } from '@googleforcreators/react';
import { withProtocol } from '@googleforcreators/url';
/**
 * Internal dependencies
 */
import Dialog from '../dialog';
import { getHotlinkDescription, isValidUrlForHotlinking } from './utils';

const InputWrapper = styled.form`
  margin: 16px 4px;
  width: 470px;
  height: 100px;
`;

function HotlinkModal({
  isOpen,
  onClose,
  onInsert,
  allowedFileTypes = [],
  insertText = __('Insert', 'web-stories'),
  insertingText = __('Inserting…', 'web-stories'),
  title,
  isInserting,
  setIsInserting,
  link,
  setLink,
  errorMsg,
  setErrorMsg,
}) {
  const inputRef = useRef(null);

  const isDisabled = errorMsg || !link || isInserting;
  const primaryText = isInserting ? insertingText : insertText;

  const description = getHotlinkDescription(allowedFileTypes);

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
  }, [link, setErrorMsg, setLink]);

  const onChange = useCallback(
    (value) => {
      // Always set the error to null when changing.
      if (errorMsg) {
        setErrorMsg(null);
      }
      setLink(value);
    },
    [errorMsg, setLink, setErrorMsg]
  );

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
  onInsert: PropTypes.func.isRequired,
  allowedFileTypes: PropTypes.array,
  title: PropTypes.string,
  insertText: PropTypes.string,
  insertingText: PropTypes.string,
  isInserting: PropTypes.bool,
  setIsInserting: PropTypes.func,
  link: PropTypes.string,
  setLink: PropTypes.func,
  errorMsg: PropTypes.string,
  setErrorMsg: PropTypes.func,
};

export default HotlinkModal;
