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
import propTypes from 'prop-types';
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

const Label = styled.label(
  ({ disabled, theme }) =>
    disabled &&
    css`
      ${Text} {
        color: ${theme.colors.fg.disable};
      }
    `
);

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

    & + ${Text} {
      color: ${theme.colors.fg[hasError ? 'negative' : 'tertiary']};
    }
  `
);

export const Input = ({ disabled, hint, id, label, ...props }) => {
  const inputId = useMemo(() => id || uuidv4(), [id]);

  return (
    <Container>
      {label && (
        <Label htmlFor={inputId} disabled={disabled}>
          <Text as="span">{label}</Text>
        </Label>
      )}
      <StyledInput id={inputId} disabled={disabled} {...props} />
      {hint && <Text>{hint}</Text>}
    </Container>
  );
};

Input.propTypes = {
  disabled: propTypes.bool,
  hasError: propTypes.bool,
  hint: propTypes.string,
  id: propTypes.string,
  label: propTypes.string,
};
