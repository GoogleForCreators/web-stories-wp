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
import PropTypes from 'prop-types';
import { forwardRef, useMemo, useState } from '@googleforcreators/react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { Text } from '../typography';
import { themeHelpers, THEME_CONSTANTS } from '../../theme';
import { focusCSS } from '../../theme/helpers';
import { labelAccessibilityValidator } from '../../utils';

const Container = styled.div`
  position: relative;
  width: 100%;
  min-width: 100px;
`;

const CounterText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
  forwardedAs: 'span',
})`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

const Label = styled(Text)`
  margin-bottom: 12px;
`;

const Hint = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  margin-top: 12px;
  color: ${({ hasError, theme }) =>
    theme.colors.fg[hasError ? 'negative' : 'tertiary']};
`;

const InputContainer = styled.div(
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
      preset:
        theme.typography.presets.paragraph[
          THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
        ],
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

export const TextArea = forwardRef(
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
      maxLength,
      isIndeterminate = false,
      containerStyleOverride = '',
      ...props
    },
    ref
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
          <Label htmlFor={textAreaId} forwardedAs="label" disabled={disabled}>
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
              if (typeof ref == 'function') {
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
              <CounterText>{`${value.length}/${maxLength}`}</CounterText>
            </Counter>
          )}
        </InputContainer>
        {hint && <Hint hasError={hasError}>{hint}</Hint>}
      </Container>
    );
  }
);

const TextAreaPropTypes = {
  'aria-label': labelAccessibilityValidator,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: labelAccessibilityValidator,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  value: PropTypes.string.isRequired,
  showCount: PropTypes.bool,
  maxLength: PropTypes.number,
  isIndeterminate: PropTypes.bool,
  containerStyleOverride: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

TextArea.propTypes = TextAreaPropTypes;
TextArea.displayName = 'TextArea';
