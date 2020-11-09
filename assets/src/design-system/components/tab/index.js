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
import { forwardRef } from 'react';
/**
 * Internal dependencies
 */
import { THEME_CONSTANTS, themeHelpers } from '../../';

const StyledTab = styled.button(
  ({ isActive, theme }) => css`
    box-sizing: content-box;
    height: 32px;
    padding: 0 16px;

    background-color: ${isActive
      ? theme.colors.interactiveBg.primaryNormal
      : theme.colors.opacity.footprint};
    border: none;
    border-radius: 50px;
    ${themeHelpers.focusableOutlineCSS(
      theme.colors.bg.primary,
      theme.colors.border.focus
    )};

    color: ${isActive ? theme.colors.bg.primary : theme.colors.fg.primary};
    cursor: pointer;
    ${themeHelpers.expandPresetStyles({
      preset:
        theme.typography.presets.label[
          THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.SMALL
        ],
      theme,
    })};

    &:disabled {
      pointer-events: none;
    }

    &:focus {
      outline: none;
    }

    transition: color 0.6s ease 0s;
    transition: background-color 0.6s ease 0s;
  `
);

export const Tab = forwardRef(function Tab(
  { children, isActive, ...rest },
  ref
) {
  return (
    <StyledTab
      ref={ref}
      role="tab"
      isActive={isActive}
      aria-selected={isActive}
      {...rest}
    >
      {children}
    </StyledTab>
  );
});

Tab.propTypes = {
  children: PropTypes.node,
  isActive: PropTypes.bool,
};
