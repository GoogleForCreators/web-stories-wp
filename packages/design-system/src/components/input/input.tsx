/*
 * Copyright 2021 Google LLC
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
import type { ForwardedRef } from 'react';
import { forwardRef, useMemo, useState } from '@googleforcreators/react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { TextSize } from '../../theme';
import { focusCSS } from '../../theme/helpers';
import type { InputProps } from './types';
import { Container, Label, Suffix, BaseInput, Hint } from './styled';

const InputContainer = styled.div<{
  focused: boolean;
  hasError?: boolean;
  styleOverride: string;
}>(
  ({ focused, hasError, theme, styleOverride }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    padding: 4px 12px;
    border: 1px solid
      ${theme.colors.border[hasError ? 'negativeNormal' : 'defaultNormal']};
    border-radius: ${theme.borders.radius.small};
    overflow: hidden;

    ${focused &&
    !hasError &&
    css`
      border-color: ${theme.colors.border.defaultActive};
    `};

    ${focused &&
    css`
      ${Suffix} {
        color: ${theme.colors.fg.primary};
      }
    `};

    :focus-within {
      ${focusCSS(theme.colors.border.focus)};
    }

    ${styleOverride};
  `
);

const Input = forwardRef(
  (
    {
      inputClassName,
      className,
      disabled,
      hasError,
      hint,
      id,
      label,
      onBlur,
      onFocus,
      hasFocus = false,
      suffix,
      unit = '',
      value = '',
      isIndeterminate = false,
      containerStyleOverride = '',
      ...props
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const inputId = useMemo(() => id || uuidv4(), [id]);

    const [isFocused, setIsFocused] = useState(hasFocus);
    const [hasBeenSelected, setHasBeenSelected] = useState(false);

    let displayedValue = value;
    if (unit && typeof value === 'string' && value.length) {
      displayedValue = `${value}${!isFocused ? `${unit}` : ''}`;
    }
    if (isIndeterminate) {
      // Display placeholder if value couldn't be determined.
      displayedValue = '';
    }
    const hasSuffix = Boolean(suffix);

    return (
      <Container className={className}>
        {label && (
          <Label htmlFor={inputId} disabled={disabled}>
            {label}
          </Label>
        )}
        <InputContainer
          focused={isFocused}
          hasError={hasError}
          styleOverride={containerStyleOverride}
        >
          <BaseInput
            id={inputId}
            disabled={disabled}
            ref={(input) => {
              // `ref` can either be a callback ref or a normal ref.
              if (typeof ref === 'function') {
                ref(input);
              } else if (ref) {
                ref.current = input;
              }
              if (input && isFocused && !hasBeenSelected) {
                input.select();
                setHasBeenSelected(true);
              }
            }}
            onFocus={(e) => {
              onFocus?.(e);
              setIsFocused(true);
              setHasBeenSelected(false);
            }}
            onBlur={(e) => {
              onBlur?.(e);
              setIsFocused(false);
            }}
            value={displayedValue}
            hasSuffix={hasSuffix}
            className={inputClassName}
            {...props}
          />
          {hasSuffix && (
            <Suffix size={TextSize.Small} onClick={() => setIsFocused(true)}>
              {suffix}
            </Suffix>
          )}
        </InputContainer>
        {hint && <Hint hasError={hasError}>{hint}</Hint>}
      </Container>
    );
  }
);

Input.displayName = 'Input';

export default Input;
