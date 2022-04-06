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
import { useState, useCallback, useEffect } from '@googleforcreators/react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { _x, __ } from '@googleforcreators/i18n';
import { PatternPropType } from '@googleforcreators/patterns';
import { NumericInput, Icons } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { inputContainerStyleOverride } from '../../panels/shared/styles';
import getPreviewOpacity from './getPreviewOpacity';

const Input = styled(NumericInput)`
  min-width: 100px;
  div {
    background-color: transparent;
  }
`;

const minimalInputContainerStyleOverride = css`
  ${inputContainerStyleOverride};
  width: 70px;
  padding-right: 6px;
`;

function OpacityInput({ value, onChange, isInDesignMenu }) {
  const [inputValue, setInputValue] = useState('');

  // Allow any input, but only persist non-NaN values up-chain
  const handleChange = useCallback(
    (evt, val) => {
      setInputValue(val);
      if (!isNaN(val)) {
        onChange(val / 100);
      }
    },
    [onChange]
  );

  const updateFromValue = useCallback(
    () => setInputValue(getPreviewOpacity(value)),
    [value]
  );

  useEffect(() => updateFromValue(), [updateFromValue, value]);

  const unit = isInDesignMenu ? null : _x('%', 'Percentage', 'web-stories');

  const containerStyle = isInDesignMenu
    ? minimalInputContainerStyleOverride
    : inputContainerStyleOverride;

  return (
    <Input
      aria-label={__('Opacity', 'web-stories')}
      onChange={handleChange}
      value={inputValue}
      unit={unit}
      suffix={<Icons.ColorDrop />}
      min={0}
      max={100}
      allowEmpty={false}
      isFloat={false}
      containerStyleOverride={containerStyle}
    />
  );
}

OpacityInput.propTypes = {
  value: PropTypes.oneOfType([PatternPropType, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  isInDesignMenu: PropTypes.bool,
};

export default OpacityInput;
