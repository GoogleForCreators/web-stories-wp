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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { THEME_CONSTANTS, themeHelpers } from '../../theme';

const StyledPill = styled.button(
  ({ isActive, theme }) => css`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 6px 16px;
    height: 32px;

    background-color: ${isActive
      ? theme.colors.interactiveBg.primaryNormal
      : theme.colors.opacity.footprint};
    border: none;
    border-radius: ${theme.borders.radius.x_large};
    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};

    color: ${isActive ? theme.colors.bg.primary : theme.colors.fg.secondary};
    cursor: pointer;
    ${themeHelpers.expandPresetStyles({
      preset:
        theme.typography.presets.label[
          THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
        ],
      theme,
    })};

    &:disabled {
      pointer-events: none;
    }

    transition: color 0.6s ease 0s;
    transition: background-color 0.6s ease 0s;
  `
);

export const Pill = ({ children, isActive, onClick, ...rest }) => {
  return (
    <StyledPill isActive={isActive} onClick={onClick} {...rest}>
      {children}
    </StyledPill>
  );
};

Pill.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
