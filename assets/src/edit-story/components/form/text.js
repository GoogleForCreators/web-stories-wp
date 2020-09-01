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
import { useRef, useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { CloseAlt as Close } from '../../icons';
import { useKeyDownEffect } from '../keyboard';
import MULTIPLE_VALUE from './multipleValue';
import { Input } from '.';

const INPUT_PADDING = 6;

const StyledInput = styled(Input)`
  width: ${({ width }) => (width ? width + 'px' : '100%')};
  border: none;
  padding-right: ${({ suffix }) => (suffix ? INPUT_PADDING : 0)}px;
  padding-left: ${({ label }) => (label ? INPUT_PADDING : 0)}px;
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  ${({ textCenter }) => textCenter && `text-align: center`};
`;

const Container = styled.div`
  color: ${({ theme }) => rgba(theme.colors.fg.white, 0.3)};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  display: flex;
  flex-direction: row;
  align-items: center;
  font-style: italic;
  background-color: ${({ theme }) => rgba(theme.colors.bg.black, 0.3)};
  position: relative;

  ${({ disabled }) => disabled && `opacity: 0.3`};

  border-radius: 4px;
  border: 1px solid transparent;
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.whiteout} !important;
  }
`;

const ClearBtn = styled.button`
  display: flex;
  padding: 0;
  padding-left: ${INPUT_PADDING}px;
  margin: 0;
  background: transparent;
  appearance: none;
  border: none;
  cursor: pointer;
`;

const CloseIcon = styled(Close)`
  color: ${({ theme }) => theme.colors.whiteout};
  width: 14px;
  height: 14px;
`;

function Clear({ onClear, showClearIconBackground, children }) {
  const ref = useRef();
  useKeyDownEffect(ref, ['enter'], onClear, [onClear]);

  return (
    <ClearBtn
      ref={ref}
      onClick={onClear}
      showBackground={showClearIconBackground}
    >
      {children}
    </ClearBtn>
  );
}

Clear.propTypes = {
  onClear: PropTypes.func,
  showClearIconBackground: PropTypes.bool,
  children: PropTypes.node,
};

function TextInput({
  className,
  onBlur,
  onChange,
  onKeyDown,
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
  const inputRef = useRef();
  const isMultiple = value === MULTIPLE_VALUE;
  value = isMultiple ? '' : value;
  placeholder = isMultiple ? __('multiple', 'web-stories') : placeholder;

  const onClear = useCallback(() => {
    onChange('');
    if (onBlur) {
      onBlur({ onClear: true });
    }
    // Return focus to text input as otherwise focus will revert to current selection
    inputRef.current?.focus();
  }, [onChange, onBlur]);

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
        ref={inputRef}
        placeholder={placeholder}
        label={label}
        value={value}
        disabled={disabled}
        {...rest}
        onChange={(evt) => onChange(evt.target.value, evt)}
        onKeyDown={onKeyDown}
        onBlur={(evt) => {
          if (evt.target.form) {
            evt.target.form.dispatchEvent(
              new window.Event('submit', { cancelable: true })
            );
          }
          if (onBlur) {
            onBlur(evt);
          }
        }}
      />
      {suffix}
      {Boolean(value) && clear && (
        <Clear
          onClear={onClear}
          showClearIconBackground={showClearIconBackground}
        >
          {clearIcon ?? (
            <CloseIcon aria-label={__('Clear input', 'web-stories')} />
          )}
        </Clear>
      )}
    </Container>
  );
}

TextInput.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
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
