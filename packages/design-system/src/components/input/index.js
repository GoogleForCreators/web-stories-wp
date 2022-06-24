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
  display: inline-block;
  width: 100%;
  min-width: 40px;
`;

const Label = styled(Text)`
  margin-bottom: 12px;
  display: inline-block;
`;

const Hint = styled(Text)`
  display: inline-block;
  margin-top: 12px;
  color: ${({ hasError, theme }) =>
    theme.colors.fg[hasError ? 'negative' : 'tertiary']};
`;

const Suffix = styled(Text)`
  background: transparent;
  color: ${({ theme }) => theme.colors.fg.tertiary};
  white-space: nowrap;

  svg {
    width: 32px;
    height: 32px;
    margin: 2px -10px;
    display: block;
  }
`;

const InputContainer = styled.div(
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

export const BaseInput = styled.input(
  ({ hasSuffix, theme }) => css`
    height: 100%;
    width: 100%;
    padding: 0;
    ${hasSuffix &&
    css`
      padding-right: 8px;
    `}
    background-color: inherit;
    border: none;
    outline: none;
    box-shadow: none;
    color: ${theme.colors.fg.primary};

    ${themeHelpers.expandPresetStyles({
      preset: {
        ...theme.typography.presets.paragraph[
          THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
        ],
      },
      theme,
    })};

    ::placeholder {
      color: ${theme.colors.fg.tertiary};
    }

    :disabled {
      color: ${theme.colors.fg.disable};
      border-color: ${theme.colors.border.disable};

      & ~ ${Suffix} {
        color: ${theme.colors.fg.disable};
      }
    }
    :focus {
      box-shadow: none;
    }
    :active:enabled {
      color: ${theme.colors.fg.primary};
    }
  `
);

export const Input = forwardRef(
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
    },
    ref
  ) => {
    const inputId = useMemo(() => id || uuidv4(), [id]);

    const [isFocused, setIsFocused] = useState(hasFocus);
    const [hasBeenSelected, setHasBeenSelected] = useState(false);

    let displayedValue = value;
    if (unit && value.length) {
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
          <Label htmlFor={inputId} forwardedAs="label" disabled={disabled}>
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
            hasSuffix={hasSuffix}
            className={inputClassName}
            {...props}
          />
          {hasSuffix && (
            <Suffix
              hasLabel={Boolean(label)}
              forwardedAs="span"
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
              onClick={() => setIsFocused(true)}
            >
              {suffix}
            </Suffix>
          )}
        </InputContainer>
        {hint && <Hint hasError={hasError}>{hint}</Hint>}
      </Container>
    );
  }
);

export const InputPropTypes = {
  'aria-label': labelAccessibilityValidator,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  id: PropTypes.string,
  label: labelAccessibilityValidator,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  suffix: PropTypes.node,
  unit: PropTypes.string,
  value: PropTypes.string,
  isIndeterminate: PropTypes.bool,
  containerStyleOverride: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

Input.propTypes = InputPropTypes;
Input.displayName = 'Input';
