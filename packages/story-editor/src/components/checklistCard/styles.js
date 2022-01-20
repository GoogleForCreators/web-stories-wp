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
import {
  Icons,
  THEME_CONSTANTS,
  Text,
  themeHelpers,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { CARD_WIDTH } from '../secondaryPopup';
import { OverflowThumbnail } from '../thumbnail';
import { GRID_TEMPLATE_AREA, GRID_VARIANT } from './constants';

const { focusableOutlineCSS } = themeHelpers;

export const Wrapper = styled.div`
  width: ${CARD_WIDTH}px;
  display: flex;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bg.secondary};
  margin: 8px 0;
`;

export const Container = styled.div`
  width: 240px;
  display: grid;
  margin: 16px;
  grid-gap: 8px;
  grid-template-columns: 52px 52px 52px 52px;
  ${({ gridVariant }) => css`
    grid-template-areas: ${GRID_TEMPLATE_AREA[gridVariant]};
  `}
`;
Container.propTypes = {
  gridVariant: PropTypes.oneOf(Object.values(GRID_VARIANT)),
};

// Titles can be divs or buttons. Buttons are for if there is an action for the user to take (like highlighting)
export const Title = styled.div`
  grid-area: title;

  &:is(button) {
    display: flex;
    outline: none;
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    border-radius: ${({ theme }) => theme.borders.radius.small};
    ${({ theme }) =>
      focusableOutlineCSS(
        theme.colors.border.focus,
        theme.colors.bg.secondary
      )};
  }
`;

export const Cta = styled.div`
  grid-area: cta;
  margin: 0;
`;

export const CheckboxCtaLabel = styled(Text).attrs({
  forwardedAs: 'label',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.linkNormal};
`;

export const CheckboxCtaContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 14px 0 6px;
  label {
    margin: 0 8px;
  }
`;

export const StyledOverflowThumbnail = styled(OverflowThumbnail)`
  width: 52px;
  cursor: pointer;
`;

export const Footer = styled.div`
  grid-area: footer;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider.primary};

  & > * {
    color: ${({ theme }) => theme.colors.fg.secondary};
  }
`;

// For use with lists
export const CardListWrapper = styled.div`
  margin-left: 16px;
  li {
    color: ${({ theme }) => theme.colors.fg.secondary};
  }
`;

export const StyledVideoOptimizationIcon = styled(Icons.GearWithGauge)`
  rect {
    color: ${({ theme }) => theme.colors.opacity.black64};
  }

  path {
    color: ${({ theme }) => theme.colors.fg.primary};
  }
`;
