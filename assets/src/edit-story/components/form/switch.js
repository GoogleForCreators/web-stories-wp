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
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const SwitchContainer = styled.div`
  appearance: none;
  position: relative;
  background: ${({ theme }) => theme.colors.bg.v3};
  border-radius: 100px;
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.86)};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  padding: 6px 3px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
`;

const RadioButton = styled.input.attrs(({ checked, value, id }) => ({
  type: 'radio',
  name: 'switch',
  checked,
  value,
  id,
}))`
  overflow: hidden;
  min-width: unset !important;
  width: 0 !important;
  height: 0 !important;
  border: 0 !important;
  padding: 0 !important;
  margin: -1px !important;
  outline: none !important;
  box-shadow: none !important;
  position: absolute;
  appearance: none;
`;

const Label = styled.label`
  z-index: 1;
  width: 50%;
  text-align: center;
  opacity: 0.86;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    `
    cursor: default;
    opacity: 0.3;
	`}

  &:focus-within ~ span {
    background-color: ${({ theme }) => theme.colors.action};
  }
`;

const SwitchSpan = styled.span`
  position: absolute;
  z-index: 0;
  top: 1px;
  left: 1px;
  display: block;
  width: calc(50% - 3px);
  height: 26px;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.bg.v10};
  transition: left 0.15s ease-out;

  ${({ hasOffset }) => hasOffset && `left: calc(50% + 2px);`}
`;

function Switch({ value, disabled, onChange, onLabel, offLabel }) {
  const [flag, setFlag] = useState(value);

  useEffect(() => {
    setFlag(value);
  }, [value, setFlag]);

  const handleChange = (checked) => {
    setFlag(checked);
    if (onChange) {
      onChange(checked);
    }
  };

  return (
    <SwitchContainer>
      <Label disabled={disabled}>
        {onLabel}
        <RadioButton
          disabled={disabled}
          onChange={() => handleChange(true)}
          checked={flag}
          value="on"
        />
      </Label>
      <Label disabled={disabled}>
        {offLabel}
        <RadioButton
          disabled={disabled}
          onChange={() => handleChange(false)}
          checked={!flag}
          value="off"
        />
      </Label>
      <SwitchSpan hasOffset={!flag} />
    </SwitchContainer>
  );
}

Switch.propTypes = {
  onChange: PropTypes.func.isRequired,
  onLabel: PropTypes.string.isRequired,
  offLabel: PropTypes.string.isRequired,
  value: PropTypes.bool,
  disabled: PropTypes.bool,
};

Switch.defaultProps = {
  value: false,
  disabled: false,
  onLabel: __('On', 'web-stories'),
  offLabel: __('Off', 'web-stories'),
};

export default Switch;
