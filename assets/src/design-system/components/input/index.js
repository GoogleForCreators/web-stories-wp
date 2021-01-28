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
import { Text } from '..';
import { themeHelpers, THEME_CONSTANTS } from '../../theme';

const Container = styled.div`
  margin: 0 12px;
`;

const StyledInput = styled.input(
  ({ hasError, theme }) => css`
    margin: 12px 0;
    padding: 8px 12px;
    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
    ${themeHelpers.expandPresetStyles({
      preset: {
        ...theme.typography.presets.label[
          THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
        ],
      },
      theme,
    })};
    background-color: ${theme.colors.bg.primary};
    border: 2px solid
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

export const Input = ({ disabled, hasError, hint, id, label, ...props }) => {
  const inputId = useMemo(() => id || uuidv4(), [id]);

  return (
    <Container>
      {label && (
        <Text htmlFor={inputId} as="label" disabled={disabled}>
          {label}
        </Text>
      )}
      <StyledInput
        id={inputId}
        disabled={disabled}
        hasError={hasError}
        {...props}
      />
      {hint && <Text hasError={hasError}>{hint}</Text>}
    </Container>
  );
};

Input.propTypes = {
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
};
