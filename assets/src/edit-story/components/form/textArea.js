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
import { useCallback, forwardRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0;
  border: none;
  appearance: none;
  box-shadow: none !important;
  outline: none;
  background-color: transparent;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.size};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.body2.letterSpacing};
  resize: ${({ resizeable }) => (resizeable ? 'auto' : 'none')};

  &:disabled {
    background-color: transparent;
    color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  }
`;

const Container = styled.div`
  width: 100%;
  color: ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.3)};
  background-color: ${({ theme }) =>
    rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.3)};

  ${({ disabled, readOnly }) => (disabled || readOnly) && `opacity: 0.3`};

  padding: 6px;
  padding-left: 12px;
  border-radius: 4px;
  border: 1px solid transparent;
  &:focus-within {
    border-color: ${({ theme }) =>
      theme.DEPRECATED_THEME.colors.whiteout} !important;
  }
`;

const Counter = styled.div`
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.tab.size};
  text-align: right;
  line-height: 1;
  padding-right: 6px;
`;

const TextArea = forwardRef(
  (
    {
      className,
      placeholder,
      value,
      maxLength,
      readOnly,
      disabled,
      resizeable,
      showTextLimit,
      rows,
      onTextChange,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const hasMaxLength = typeof maxLength === 'number';
    const showCounter = showTextLimit && hasMaxLength;

    const handleChange = useCallback(
      (e) => {
        const str = e.target.value || '';
        const text = hasMaxLength ? str.slice(0, maxLength) : str;

        onTextChange(text, e);
      },
      [onTextChange, hasMaxLength, maxLength]
    );

    const handleBlur = useCallback(
      (e) => {
        if (e.target.form) {
          e.target.form.dispatchEvent(
            new window.Event('submit', { cancelable: true })
          );
        }

        if (onBlur) {
          onBlur(e);
        }
      },
      [onBlur]
    );

    return (
      <Container className={className}>
        <StyledTextArea
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          resizeable={resizeable}
          rows={rows}
          value={value}
          {...rest}
          onChange={handleChange}
          onBlur={handleBlur}
          ref={ref}
        />
        {showCounter && <Counter>{`${value.length}/${maxLength}`}</Counter>}
      </Container>
    );
  }
);

TextArea.displayName = 'TextArea';

TextArea.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  resizeable: PropTypes.bool,
  showTextLimit: PropTypes.bool,
  rows: PropTypes.number,
  onTextChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
};

TextArea.defaultProps = {
  showTextLimit: true,
  rows: 2,
};

export default TextArea;
