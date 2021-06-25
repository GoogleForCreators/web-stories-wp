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
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_VARIANTS,
  Text,
  ThemeGlobals,
  themeHelpers,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
import { PANEL_STATES } from './constants';

export const Tablist = styled.div.attrs({ role: 'tablist' })`
  width: 308px;
  background: ${({ theme }) => theme.colors.bg.primary};
`;
Tablist.propTypes = {
  // label to describe purpose of tabs
  'aria-label': PropTypes.string.isRequired,
};

export const PanelWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.bg.primary};

  ${({ isExpanded, theme }) =>
    isExpanded &&
    css`
      & > ${TabButton} {
        ${PanelText} {
          opacity: 1;
        }

        &,
        :hover,
        :focus {
          background-color: ${theme.colors.bg.primary};
        }

        svg {
          transform: rotate(0);
        }
      }

      & > ${TabPanel} {
        height: 560px;
        padding: 16px;
        visibility: visible;
      }
    `};
`;

export const PanelText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
  isBold: true,
})`
  transition: background-color 300ms ease-in;
`;

export const TabButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.PLAIN,
})`
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  padding: 16px;
  margin-bottom: 1px;
  border-radius: 0;
  box-shadow: 0px -1px 0 0 ${({ theme }) => theme.colors.divider.tertiary};

  &,
  :hover,
  :focus,
  .${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} {
    background-color: ${({ theme }) => theme.colors.bg.secondary};
  }

  :focus,
  &.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} {
    z-index: 2;
  }

  ${PanelText} {
    opacity: 0.8;
  }

  ${({ status }) =>
    status === PANEL_STATES.DANGER &&
    css`
      &,
      ${PanelText} {
        color: ${({ theme }) => theme.colors.fg.negative};
      }

      ${Badge} {
        background-color: ${({ theme }) => theme.colors.fg.negative};
      }
    `};
`;

export const ButtonText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -12px;
`;

export const IconContainer = styled.div`
  height: 32px;
  width: 32px;

  color: ${({ theme }) => theme.colors.fg.primary};

  svg {
    transform: rotate(-90deg);
    transition: transform 300ms ease-in-out;
  }
`;

export const Badge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  border-radius: ${({ theme }) => theme.borders.radius.round};
  background-color: ${({ theme }) => theme.colors.fg.primary};

  ${PanelText} {
    color: ${({ theme }) => theme.colors.inverted.fg.primary};
    line-height: 20px;
  }
`;

export const TabPanel = styled.div`
  height: 0;
  padding: 0;
  visibility: hidden;
  overflow-y: scroll;
  background: ${({ theme }) => theme.colors.bg.primary};
  transition: 250ms ease-in;

  ${themeHelpers.scrollbarCSS};
`;
