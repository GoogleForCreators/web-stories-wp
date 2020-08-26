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
import { useCallback, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { KEYBOARD_USER_SELECTOR } from '../../utils/keyboardOnlyOutline';
import { useKeyDownEffect } from '../keyboard';

const SwitchContainer = styled.div`
  appearance: none;
  position: relative;
  background: ${({ theme }) => rgba(theme.colors.bg.divider, 0.04)};
  border-radius: 100px;
  color: ${({ theme }) => rgba(theme.colors.fg.white, 0.86)};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  padding: 8px 4px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
`;

// Class should contain "mousetrap" to enable keyboard shortcuts on inputs.
const RadioButton = styled.input.attrs(({ checked, value, id }) => ({
  type: 'radio',
  name: 'switch',
  className: 'mousetrap',
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1;
  padding: 0px 6px;
  color: ${({ hasOffset, theme }) =>
    hasOffset ? theme.colors.bg.workspace : theme.colors.bg.divider};

  ${({ disabled }) =>
    disabled &&
    `
    cursor: default;
    opacity: 0.3;
  `}

  ${KEYBOARD_USER_SELECTOR} &:focus-within ~ span {
    background-color: ${({ theme }) => theme.colors.accent.primary};
  }
`;

const SwitchSpan = styled.span`
  position: absolute;
  z-index: 0;
  top: 1px;
  left: 1px;
  display: block;
  width: calc(50% - 3px);
  height: 28px;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.fg.primary};
  transition: left 0.15s ease-out;

  ${({ hasOffset }) => hasOffset && `left: calc(50% + 2px);`}
`;

function Switch({ value, disabled, onChange, onLabel, offLabel }) {
  const handleChange = useCallback(
    (checked) => {
      if (onChange) {
        onChange(checked);
      }
    },
    [onChange]
  );
  const ref = useRef();
  useKeyDownEffect(ref, ['left', 'right'], () => handleChange(!value), [
    handleChange,
    value,
  ]);

  return (
    <SwitchContainer ref={ref}>
      <Label disabled={disabled} hasOffset={Boolean(value)}>
        {onLabel}
        <RadioButton
          disabled={disabled}
          onChange={() => handleChange(true)}
          checked={value}
          value="on"
        />
      </Label>
      <Label disabled={disabled} hasOffset={!value}>
        {offLabel}
        <RadioButton
          disabled={disabled}
          onChange={() => handleChange(false)}
          checked={!value}
          value="off"
        />
      </Label>
      <SwitchSpan hasOffset={!value} />
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
