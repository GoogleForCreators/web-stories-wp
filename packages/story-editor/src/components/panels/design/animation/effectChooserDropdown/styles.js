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
/**
 * Internal dependencies
 */
import { INPUT_HEIGHT } from '../constants';
import { focusStyle } from '../../../shared/styles';
import { BaseAnimationCell, GRID_ITEM_HEIGHT } from './effectChooserElements';
import { GRID_SIZING } from './dropdownConstants';

export const ContentWrapper = styled.div`
  display: inline-block;
`;

const getGridColumnStart = (gridSpace) => {
  switch (gridSpace) {
    case GRID_SIZING.HALF:
      return 'span 2';

    case GRID_SIZING.QUARTER:
      return 'span 1';

    default:
      return 'span 4';
  }
};

export const AnimationListItem = styled.li`
  border: none;
  background: ${({ active, theme }) =>
    active
      ? theme.colors.interactiveBg.secondaryPress
      : theme.colors.interactiveBg.secondaryNormal};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  height: ${GRID_ITEM_HEIGHT}px;
  position: relative;
  grid-column-start: ${({ gridSpace }) => getGridColumnStart(gridSpace)};
  overflow: hidden;
  font-family: 'Teko', sans-serif;
  font-size: ${({ size = 28 }) => size}px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.fg.primary};
  text-transform: uppercase;
  transition: background 0.1s linear;
  margin: 0;
  /* Account for tooltip nested inside of list items wrapping actual content */
  & > div {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  &[aria-disabled='true'] {
    background: ${({ theme }) => theme.colors.interactiveBg.disable};
  }

  &:hover:not([aria-disabled='true']) {
    cursor: pointer;
  }

  &:hover:not([aria-disabled='true']),
  &:focus:not([aria-disabled='true']) {
    background: ${({ active, theme }) =>
      active
        ? theme.colors.interactiveBg.secondaryPress
        : theme.colors.interactiveBg.secondaryHover};

    ${BaseAnimationCell} {
      display: inline-block;
    }
    ${ContentWrapper} {
      display: none;
    }
  }

  ${({ noEffect }) =>
    noEffect &&
    css`
      height: 36px;
      font-size: 14px;
      text-transform: none;

      /* noEffect doesn't have an active style so we want to just leave the display alone */
      ${ContentWrapper} {
        display: inline-block !important;
      }
    `}

  ${focusStyle};
`;

export const styleOverrideForAnimationEffectMenu = css`
  display: inline-block;
  margin-top: 0;
  padding: 16px 4px 16px 16px;
  ul {
    display: grid;
    justify-content: center;
    gap: 12px 4px;
    grid-template-columns: repeat(4, 1fr);
    position: relative;
  }
`;

export const styleOverrideForSelectButton = ({ theme }) => css`
  margin: -1px -1px 0 -1px;
  width: calc(100% + 2px);
  border-color: transparent transparent ${theme.colors.border.defaultNormal}
    transparent;
  height: ${INPUT_HEIGHT}px;
  &:hover {
    border-color: transparent transparent ${theme.colors.border.defaultNormal}
      transparent;
  }

  ${focusStyle}
`;
