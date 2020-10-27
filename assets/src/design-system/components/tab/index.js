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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../';

const StyledTab = styled.button(
  ({ isActive, theme }) => `
    box-sizing: content-box;
    height: 32px;
    padding: 0 16px;

    background-color: ${
      isActive ? theme.colors.bg.primary : theme.colors.bg.divider
    };
    border: none;
    border-radius: 50px;
    box-shadow: 0 0 0 2px ${theme.colors.standard.white};
    color: ${isActive ? theme.colors.fg.primary : theme.colors.fg.secondary};
    cursor: pointer;


    font-family: ${theme.typography.family.primary};
    font-size: ${
      theme.typography.presets.label[
        THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.SMALL
      ].size
    }px;
    font-weight: ${
      theme.typography.presets.label[
        THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.SMALL
      ].weight
    };
    letter-spacing: ${
      theme.typography.presets.label[
        THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.SMALL
      ].letterSpacing
    }px;
    line-height: ${
      theme.typography.presets.label[
        THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.SMALL
      ].lineHeight
    }px;

    &:disabled {
        pointer-events: none;
    }

    &:hover {
        color: ${isActive ? theme.colors.fg.primary : theme.colors.bg.primary};
    }

    &:focus {
        box-shadow: 
          0 0 0 2px ${theme.colors.standard.white}, 
          0 0 0 4px ${theme.colors.accent.secondary};
        outline: none;
        color: ${isActive ? theme.colors.fg.primary : theme.colors.bg.primary};
    }
    
    transition: color 0.6s ease 0s;
    `
);

export const Tab = forwardRef(function Tab(
  { ariaControlId, children, isActive, ...rest },
  ref
) {
  return (
    <StyledTab
      ref={ref}
      role="tab"
      isActive={isActive}
      aria-selected={isActive}
      aria-controls={ariaControlId}
      {...rest}
    >
      {children}
    </StyledTab>
  );
});

Tab.propTypes = {
  ariaControlId: PropTypes.string,
  children: PropTypes.node,
  isActive: PropTypes.bool,
};
