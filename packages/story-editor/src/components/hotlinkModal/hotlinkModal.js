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
import { useRef, useLayoutEffect } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import Dialog from '../dialog';
import useHotlinkModal from './useHotlinkModal';

const InputWrapper = styled.form`
  margin: 16px 4px;
  width: 470px;
  height: 100px;
`;

function HotlinkModal({
  isOpen,
  onClose,
  onSelect,
  onError,
  allowedFileTypes = [],
  insertText = __('Insert', 'web-stories'),
  insertingText = __('Inserting…', 'web-stories'),
  title,
  canUseProxy = true,
  defaultErrorMsg = null,
}) {
  const inputRef = useRef(null);

  const {
    action: { onSubmit, onBlur, onChange, onCloseDialog, onInsert },
    state: { errorMsg, isInserting, link, description, isDisabled },
  } = useHotlinkModal({
    allowedFileTypes,
    onClose,
    onError,
    onSelect,
    canUseProxy,
  });

  const primaryText = isInserting ? insertingText : insertText;

  useLayoutEffect(() => {
    // Wait one tick to ensure the input has been loaded.
    const timeout = setTimeout(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    });
    return () => clearTimeout(timeout);
  }, [isOpen, inputRef]);

  return (
    <Dialog
      onClose={onCloseDialog}
      isOpen={isOpen}
      title={title}
      onPrimary={onInsert}
      primaryText={primaryText}
      secondaryText={__('Cancel', 'web-stories')}
      primaryRest={{ disabled: isDisabled }}
    >
      <InputWrapper onSubmit={onSubmit}>
        <Input
          ref={inputRef}
          onChange={onChange}
          value={link}
          hint={defaultErrorMsg || errorMsg || description}
          hasError={Boolean(defaultErrorMsg) || Boolean(errorMsg)}
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
  allowedFileTypes: PropTypes.array,
  insertText: PropTypes.string,
  insertingText: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  canUseProxy: PropTypes.bool,
  defaultErrorMsg: PropTypes.string,
};

export default HotlinkModal;
