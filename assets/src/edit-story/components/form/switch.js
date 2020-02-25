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
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

const SwitchContainer = styled.div`
  appearance: none;
  position: relative;
  background: ${({ theme }) => theme.colors.fg.v1};
  border-radius: 100px;
  color: ${({ theme }) => theme.colors.mg.v3};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  padding: 8px 3px;
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
  width: 1px !important;
  height: 1px !important;
  border: 0 !important;
  padding: 0 !important;
  margin: -1px !important;
  position: absolute;

  &:focus {
    box-shadow: none !important;
  }
`;

const Label = styled.label`
  z-index: 1;
  width: 50%;
  text-align: center;
  opacity: 0.86;

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    opacity: 0.3;
	`}
`;

const OffLabel = styled(Label)``;

const SwitchSpan = styled.span`
  position: absolute;
  z-index: 0;
  top: 3px;
  left: 3px;
  display: block;
  width: calc(50% - 3px);
  height: 26px;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.fg.v2};
  transition: left 0.15s ease-out;

  ${RadioButton}:checked + ${OffLabel} ~ & {
    left: 50%;
  }
`;

function Switch({ value, disabled, onChange, onLabel, offLabel }) {
  return (
    <SwitchContainer>
      <RadioButton
        onClick={() => onChange(false)}
        checked={!value}
        value="off"
        id={`${onLabel}-${offLabel}-switch-off`}
        aria-label={sprintf(__('Switch %s.', 'web-stories'), offLabel)}
      />
      <Label disabled={disabled} htmlFor={`${onLabel}-${offLabel}-switch-off`}>
        {offLabel}
      </Label>
      <RadioButton
        onClick={() => onChange(true)}
        checked={value}
        value="on"
        id={`$${onLabel}-${offLabel}-switch-on`}
        aria-label={sprintf(__('Switch %s.', 'web-stories'), onLabel)}
      />
      <OffLabel
        disabled={disabled}
        htmlFor={`$${onLabel}-${offLabel}-switch-on`}
      >
        {onLabel}
      </OffLabel>
      <SwitchSpan />
    </SwitchContainer>
  );
}

Switch.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  onLabel: PropTypes.string,
  offLabel: PropTypes.string,
};

Switch.defaultProps = {
  disabled: false,
  onLabel: __('On', 'web-stories'),
  offLabel: __('Off', 'web-stories'),
};

export default Switch;
