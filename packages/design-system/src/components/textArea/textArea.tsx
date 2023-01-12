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
import type { ForwardedRef, ComponentPropsWithoutRef } from 'react';
import { forwardRef, useMemo, useState } from '@googleforcreators/react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { themeHelpers, TextSize } from '../../theme';
import { focusCSS } from '../../theme/helpers';
import { Text } from '../typography';

const Container = styled.div`
  position: relative;
  width: 100%;
  min-width: 100px;
`;

const CounterText = styled(Text.Span).attrs({
  size: TextSize.XSmall,
})`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

const Label = styled(Text.Label)`
  margin-bottom: 12px;
`;

const Hint = styled(Text.Paragraph).attrs({
  size: TextSize.Small,
})<{ hasError?: boolean }>`
  margin-top: 12px;
  color: ${({ hasError, theme }) =>
    theme.colors.fg[hasError ? 'negative' : 'tertiary']};
`;

const InputContainer = styled.div<{
  focused?: boolean;
  hasError?: boolean;
  styleOverride?: string;
}>(
  ({ focused, hasError, theme, styleOverride }) => css`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border: 1px solid
      ${theme.colors.border[hasError ? 'negativeNormal' : 'defaultNormal']};
    border-radius: ${theme.borders.radius.small};
    overflow: hidden;

    ${focused &&
    !hasError &&
    css`
      border-color: ${theme.colors.border.defaultActive};
    `};

    :focus-within {
      ${focusCSS(theme.colors.border.focus)};
    }

    ${styleOverride};
  `
);

const StyledTextArea = styled.textarea(
  ({ theme }) => css`
    height: 100%;
    width: 100%;
    padding: 0;
    background-color: inherit;
    border: none;
    outline: none;
    color: ${theme.colors.fg.primary};
    resize: none;
    box-shadow: none;
    ${themeHelpers.scrollbarCSS};

    ${themeHelpers.expandPresetStyles({
      preset: theme.typography.presets.paragraph[TextSize.Small],
      theme,
    })};

    :focus {
      box-shadow: none;
    }

    :disabled {
      color: ${theme.colors.fg.disable};
      border-color: ${theme.colors.border.disable};
    }

    :active {
      color: ${theme.colors.fg.primary};
    }

    ::placeholder {
      color: ${theme.colors.fg.tertiary};
    }
  `
);

const Counter = styled.div`
  text-align: right;
  align-self: flex-end;
  span {
    color: ${({ theme }) => theme.colors.fg.tertiary};
  }
`;

interface TextAreaProps
  extends Omit<ComponentPropsWithoutRef<'textarea'>, 'value'> {
  hasError?: boolean;
  hint?: string;
  label?: string;
  showCount?: boolean;
  maxLength?: number;
  isIndeterminate?: boolean;
  containerStyleOverride?: string;
  value?: string;
}

const TextArea = forwardRef(
  (
    {
      className,
      disabled,
      hasError,
      hint,
      id,
      label,
      onBlur,
      onFocus,
      value,
      showCount = false,
      maxLength = 0,
      isIndeterminate = false,
      containerStyleOverride = '',
      ...props
    }: TextAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const textAreaId = useMemo(() => id || uuidv4(), [id]);

    const hasCounter = showCount && maxLength > 0;

    const [isFocused, setIsFocused] = useState(false);
    const [hasBeenSelected, setHasBeenSelected] = useState(false);

    let displayedValue = value;
    if (isIndeterminate) {
      // Display placeholder if value couldn't be determined.
      displayedValue = '';
    }

    return (
      <Container className={className}>
        {label && (
          <Label htmlFor={textAreaId} disabled={disabled}>
            {label}
          </Label>
        )}
        <InputContainer
          focused={isFocused}
          hasError={hasError}
          styleOverride={containerStyleOverride}
        >
          <StyledTextArea
            id={textAreaId}
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
            maxLength={maxLength}
            {...props}
          />
          {hasCounter && (
            <Counter>
              <CounterText>{`${
                String(value).length
              }/${maxLength}`}</CounterText>
            </Counter>
          )}
        </InputContainer>
        {hint && <Hint hasError={hasError}>{hint}</Hint>}
      </Container>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
