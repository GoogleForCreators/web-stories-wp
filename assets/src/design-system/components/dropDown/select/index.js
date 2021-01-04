/*
 * Copyright 2020 Google LLC
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
import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../../theme';
import {
  SelectButton,
  StyledChevron,
  Value,
  LabelText,
  Label,
} from './components';

const DropDownSelect = (
  {
    activeItemLabel,
    disabled,
    dropDownLabel,
    hasError,
    isOpen,
    onSelectClick,
    placeholder = '',
    ...rest
  },
  ref
) => (
  <SelectButton
    aria-haspopup
    isOpen={isOpen}
    disabled={disabled}
    hasError={hasError}
    onClick={onSelectClick}
    ref={ref}
    {...rest}
  >
    <Value as="span" size={THEME_CONSTANTS.TYPOGRAPHY.TEXT_SIZES.SMALL}>
      {activeItemLabel || placeholder}
    </Value>

    <Label>
      {dropDownLabel && (
        <LabelText as="span" size={THEME_CONSTANTS.TYPOGRAPHY.TEXT_SIZES.SMALL}>
          {dropDownLabel}
        </LabelText>
      )}

      <StyledChevron isOpen={isOpen} />
    </Label>
  </SelectButton>
);

export default forwardRef(DropDownSelect);

DropDownSelect.propTypes = {
  activeItemLabel: PropTypes.string,
  dropDownLabel: PropTypes.string,
  onSelectClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  isOpen: PropTypes.bool,
};
