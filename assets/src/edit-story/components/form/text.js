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
import { ReactComponent as Close } from '../../icons/close_icon.svg';
import { Input } from '.';

const StyledInput = styled(Input)`
  width: 100%;
  border: none;
  padding-right: ${({ suffix }) => (Boolean(suffix) ? 6 : 0)}px;
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
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.3)};
  flex-basis: ${({ flexBasis }) => flexBasis}px;
  position: relative;

  ${({ disabled }) => disabled && `opacity: 0.3`};
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 8px;
  appearance: none;
  background: ${({ theme }) => rgba(theme.colors.fg.v0, 0.54)};
  width: 16px;
  height: 16px;
  border: none;
  padding: 0px;
  border-radius: 50%;
  display: flex;
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
  isMultiple,
  label,
  value,
  flexBasis,
  ariaLabel,
  disabled,
  clear,
  ...rest
}) {
  const placeholder = isMultiple ? __('multiple', 'web-stories') : '';

  return (
    <Container
      className={`${className}`}
      flexBasis={flexBasis}
      disabled={disabled}
    >
      <StyledInput
        placeholder={placeholder}
        label={label}
        value={`${value}`}
        aria-label={ariaLabel}
        disabled={disabled}
        {...rest}
        onChange={(evt) => onChange(evt.target.value, evt)}
        onBlur={(evt) => {
          if (evt.target.form) {
            evt.target.form.dispatchEvent(new window.Event('submit'));
          }
          if (onBlur) {
            onBlur();
          }
        }}
      />
      {Boolean(value) && clear && (
        <ClearBtn
          onClick={(evt) => {
            onChange('');
            if (evt.target.form) {
              evt.target.form.dispatchEvent(new window.Event('submit'));
            }
            if (onBlur) {
              onBlur();
            }
          }}
        >
          <CloseIcon />
        </ClearBtn>
      )}
    </Container>
  );
}

TextInput.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any.isRequired,
  isMultiple: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  flexBasis: PropTypes.number,
  textCenter: PropTypes.bool,
  clear: PropTypes.bool,
  ariaLabel: PropTypes.string,
};

TextInput.defaultProps = {
  className: null,
  disabled: false,
  isMultiple: false,
  flexBasis: 100,
  textCenter: false,
  clear: false,
  ariaLabel: __('Standard input', 'web-stories'),
};

export default TextInput;
