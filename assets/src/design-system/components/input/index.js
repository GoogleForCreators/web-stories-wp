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
import { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { Text } from '../typography/text';
import { themeHelpers, THEME_CONSTANTS } from '../../theme';

const Container = styled.div`
  width: 100%;
`;

const Label = styled(Text)`
  margin-bottom: 12px;
`;

const Hint = styled(Text)`
  margin-top: 12px;
`;

const StyledInput = styled.input(
  ({ hasError, theme }) => css`
    box-sizing: border-box;
    height: 36px;
    width: 100%;
    padding: 8px 12px;
    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
    ${themeHelpers.expandPresetStyles({
      preset: {
        ...theme.typography.presets.paragraph[
          THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
        ],
      },
      theme,
    })};
    background-color: ${theme.colors.bg.primary};
    border: 1px solid
      ${theme.colors.border[hasError ? 'negativeNormal' : 'defaultNormal']};
    border-radius: ${theme.borders.radius.small};
    color: ${theme.colors.fg.primary};

    :active {
      border-color: ${theme.colors.border.defaultActive};
    }

    :disabled {
      color: ${theme.colors.fg.disable};
      border-color: ${theme.colors.border.disable};
    }

    & + p {
      color: ${theme.colors.fg[hasError ? 'negative' : 'tertiary']};
    }
  `
);

export const Input = ({
  className,
  disabled,
  hasError,
  hint,
  id,
  label,
  ...props
}) => {
  const inputId = useMemo(() => id || uuidv4(), [id]);

  return (
    <Container className={className}>
      {label && (
        <Label
          id="input-label"
          htmlFor={inputId}
          as="label"
          disabled={disabled}
        >
          {label}
        </Label>
      )}
      <StyledInput
        id={inputId}
        disabled={disabled}
        hasError={hasError}
        {...props}
      />
      {hint && (
        <Hint id="input-hint" hasError={hasError}>
          {hint}
        </Hint>
      )}
    </Container>
  );
};

/**
 * Custom propTypes validator used to check if either `label`
 * or `aria-label` have been passed to the component.
 * This also checks that they are of the correct type.
 *
 * @param {Object} props the props supplied to the component.
 * @param {string} _ the name of the prop.
 * @param {string} componentName the name of the component.
 * @return {Error|null} Returns an error if the conditions have not been met.
 * Otherwise, returns null.
 */
export const labelAccessibilityValidator = function (props, _, componentName) {
  if (!props.label && !props['aria-label']) {
    return new Error(
      `\`label\` or \`aria-label\` must be supplied to \`${componentName}\`. Validation failed.`
    );
  }

  if (props.label && typeof props.label !== 'string') {
    return new Error(
      `Invalid prop \`label\` of type \`${typeof props.label}\` supplied to \`${componentName}\`, expected \`string\`.`
    );
  }

  if (props['aria-label'] && typeof props['aria-label'] !== 'string') {
    return new Error(
      `Invalid prop \`aria-label\` of type \`${typeof props[
        'aria-label'
      ]}\` supplied to \`${componentName}\`, expected \`string\`.`
    );
  }

  return null;
};

Input.propTypes = {
  'aria-label': labelAccessibilityValidator,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: labelAccessibilityValidator,
};
