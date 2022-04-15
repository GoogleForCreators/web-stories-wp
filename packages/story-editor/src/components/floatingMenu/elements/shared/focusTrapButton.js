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

import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, BUTTON_TYPES } from '@googleforcreators/design-system';
import { forwardRef } from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import { v4 as uuidv4 } from 'uuid';

const _FocusTrapButton = styled(Button).attrs({ type: BUTTON_TYPES.DEFAULT })`
  background-color: transparent;
  display: inline;
  outline: none;
  margin: 0;
  padding: 0;
  min-width: inherit;
`;

export const handleReturnTrappedFocus = (e, buttonRef) => {
  // only bubble up for moving focus
  if (e.key === 'Tab') {
    e.preventDefault();
    buttonRef.current.focus();
  } else {
    e.stopPropagation();
  }
};

const FocusTrapButton = forwardRef(function FocusTrapButton(
  { inputRef, inputLabel, children },
  ref
) {
  return (
    <_FocusTrapButton
      id={uuidv4()}
      tabIndex={-1}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        inputRef.current.focus();
      }}
      onBlur={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        e.preventDefault();

        if (e.key === 'Enter') {
          inputRef.current.focus();
        }
      }}
      aria-label={sprintf(
        /* translators: %s: input label that is accessible by pressing Enter */
        __('Press Enter to edit %s', 'web-stories'),
        inputLabel
      )}
    >
      {children}
    </_FocusTrapButton>
  );
});

export default FocusTrapButton;

FocusTrapButton.propTypes = {
  inputRef: PropTypes.object.isRequired,
  inputLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
