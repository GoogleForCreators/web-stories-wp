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
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { CloseAlt as Close } from '../../icons';
import MULTIPLE_VALUE from './multipleValue';
import { Input } from '.';

const StyledInput = styled(Input)`
  width: ${({ width }) => (width ? width + 'px' : '100%')};
  border: none;
  padding-right: ${({ suffix }) => (suffix ? 6 : 0)}px;
  padding-left: ${({ label }) => (label ? 6 : 0)}px;
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  ${({ textCenter }) => textCenter && `text-align: center`};
`;

const Container = styled.div`
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.3)};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  display: flex;
  flex-direction: row;
  align-items: center;
  font-style: italic;
  background-color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.3)};
  flex-basis: ${({ flexBasis }) => flexBasis}px;
  position: relative;

  ${({ disabled }) => disabled && `opacity: 0.3`};
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 8px;
  appearance: none;
  background-color: ${({ theme, showBackground }) =>
    showBackground ? rgba(theme.colors.fg.v0, 0.54) : `transparent`};
  border: none;
  padding: 4px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const CloseIcon = styled(Close)`
  width: 12px;
  height: 12px;
`;

function TextInput({
  className,
  onBlur,
  onChange,
  label,
  value,
  flexBasis,
  disabled,
  clear,
  clearIcon,
  showClearIconBackground,
  placeholder,
  ...rest
}) {
  const { suffix } = rest;
  const isMultiple = value === MULTIPLE_VALUE;
  value = isMultiple ? '' : value;
  placeholder = isMultiple ? __('multiple', 'web-stories') : placeholder;

  const onClear = (evt) => {
    onChange('');
    if (evt.target.form) {
      evt.target.form.dispatchEvent(
        new window.Event('submit', { cancelable: true })
      );
    }
    if (onBlur) {
      onBlur({ onClear: true });
    }
  };

  return (
    <Container
      className={`${className}`}
      flexBasis={flexBasis}
      disabled={disabled}
      suffix={suffix}
    >
      {/* type="text" is default but added here due to an a11y-related bug. See https://github.com/A11yance/aria-query/pull/42 */}
      <StyledInput
        type="text"
        placeholder={placeholder}
        label={label}
        value={value}
        disabled={disabled}
        {...rest}
        onChange={(evt) => onChange(evt.target.value, evt)}
        onBlur={(evt) => {
          if (evt.target.form) {
            evt.target.form.dispatchEvent(
              new window.Event('submit', { cancelable: true })
            );
          }
          if (onBlur) {
            onBlur();
          }
        }}
      />
      {suffix}
      {Boolean(value) && clear && (
        <ClearBtn onClick={onClear} showBackground={showClearIconBackground}>
          {clearIcon ?? <CloseIcon />}
        </ClearBtn>
      )}
    </Container>
  );
}

TextInput.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  flexBasis: PropTypes.number,
  textCenter: PropTypes.bool,
  clear: PropTypes.bool,
  clearIcon: PropTypes.any,
  showClearIconBackground: PropTypes.bool,
  placeholder: PropTypes.string,
};

TextInput.defaultProps = {
  className: null,
  disabled: false,
  flexBasis: 100,
  textCenter: false,
  clear: false,
  showClearIconBackground: true,
  placeholder: null,
};

export default TextInput;
