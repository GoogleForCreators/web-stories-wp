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
import {
  forwardRef,
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { Text } from '../typography';
import { themeHelpers, THEME_CONSTANTS } from '../../theme';
import { focusCSS } from '../../theme/helpers';
import {
  useInputEventHandlers,
  labelAccessibilityValidator,
} from '../../utils';

const Container = styled.div`
  position: relative;
  width: 100%;
  min-width: 100px;
`;

const Label = styled(Text)`
  margin-bottom: 12px;
`;

const Hint = styled(Text)`
  margin-top: 12px;
  color: ${({ hasError, theme }) =>
    theme.colors.fg[hasError ? 'negative' : 'tertiary']};
`;

const InputContainer = styled.div(
  ({ focused, hasError, theme }) => css`
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
    ${themeHelpers.scrollbarCSS};

    ${themeHelpers.expandPresetStyles({
      preset:
        theme.typography.presets.paragraph[
          THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
        ],
      theme,
    })};

    :disabled {
      color: ${theme.colors.fg.disable};
      border-color: ${theme.colors.border.disable};
    }

    :active {
      color: ${theme.colors.fg.primary};
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
      onChange,
      ...props
    },
    ref
  ) => {
    const textAreaId = useMemo(() => id || uuidv4(), [id]);
    const textAreaRef = useRef(null);
    const [focused, setFocused] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const hasCounter = showCount && maxLength > 0;

    const { handleBlur, handleFocus } = useInputEventHandlers({
      forwardedRef: ref,
      inputRef: textAreaRef,
      focused,
      setFocused,
      onBlur,
      onFocus,
    });

    // Change happens only once blurring to avoid repeated onChange calls for each letter change.
    const handleChange = useCallback(
      (evt) => {
        if (currentValue !== value) {
          onChange(evt);
        }
      },
      [currentValue, onChange, value]
    );

    // If new value comes from the outer world, update the local, too.
    useEffect(() => {
      setCurrentValue(value);
    }, [value]);

    let displayedValue = currentValue;
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
        <InputContainer focused={focused} hasError={hasError}>
          <StyledTextArea
            id={textAreaId}
            disabled={disabled}
            ref={ref || textAreaRef}
            onBlur={(evt) => {
              handleChange(evt);
              handleBlur(evt);
            }}
            onFocus={handleFocus}
            value={displayedValue}
            maxLength={maxLength}
            onChange={(evt) => setCurrentValue(evt.target.value)}
            {...props}
          />
          {hasCounter && (
            <Counter>
              <Text
                as="span"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              >{`${value.length}/${maxLength}`}</Text>
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
};

TextArea.propTypes = TextAreaPropTypes;
TextArea.displayName = 'TextArea';
