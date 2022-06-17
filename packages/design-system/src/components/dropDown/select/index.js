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
import { forwardRef } from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../../theme';
import {
  SelectButton,
  Disclosure,
  Value,
  LabelText,
  Label,
} from './components';

const DropDownSelect = (
  {
    activeItemLabel,
    activeItemRenderer,
    disabled,
    dropDownLabel,
    hasError,
    isOpen,
    onSelectClick,
    placeholder = '',
    ...rest
  },
  ref
) => {
  const ValueRenderer = activeItemRenderer;
  return (
    <SelectButton
      aria-haspopup
      isOpen={isOpen}
      disabled={disabled}
      hasError={hasError}
      onClick={onSelectClick}
      ref={ref}
      autoHeight={activeItemRenderer}
      {...rest}
    >
      {activeItemRenderer ? (
        <ValueRenderer />
      ) : (
        <Value
          forwardedAs="span"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          selectValueStylesOverride={rest.selectValueStylesOverride}
        >
          {activeItemLabel || placeholder}
        </Value>
      )}

      <Label>
        {dropDownLabel && (
          <LabelText
            forwardedAs="span"
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          >
            {dropDownLabel}
          </LabelText>
        )}

        <Disclosure isOpen={isOpen} />
      </Label>
    </SelectButton>
  );
};

export default forwardRef(DropDownSelect);

DropDownSelect.propTypes = {
  activeItemLabel: PropTypes.string,
  activeItemRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  dropDownLabel: PropTypes.string,
  onSelectClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  isOpen: PropTypes.bool,
};
