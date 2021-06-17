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
import { focusableOutlineCSS } from '../../../design-system/theme/helpers';
import { OverflowThumbnail } from '../thumbnail';
import { GRID_TEMPLATE_AREA, GRID_VARIANT } from './constants';

export const Wrapper = styled.div`
  width: 272px;
  display: flex;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bg.secondary};
  &:hover {
    background: ${({ theme }) => theme.colors.interactiveBg.secondaryHover};
  }
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
  gridVariant: PropTypes.oneOf(Object.values(GRID_VARIANT)).isRequired,
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
    ${focusableOutlineCSS}
  }
`;

export const Cta = styled.div`
  grid-area: cta;
  margin: 0;
`;

export const ThumbnailWrapper = styled.div`
  grid-area: thumbnail;

  ${({ $isMultiple, $colCount }) =>
    $isMultiple &&
    css`
      display: grid;
      grid-gap: 8px;
      grid-template-columns: repeat(${$colCount}, 52px);
      overflow: hidden;
      grid-auto-flow: column;
    `}
`;

export const StyledOverflowThumbnail = styled(OverflowThumbnail)`
  grid-area: thumbnail-overflow;
  width: 52px;
`;

export const Footer = styled.div`
  grid-area: footer;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider.primary};
`;

// For use with lists
export const CardListWrapper = styled.div`
  margin-left: 16px;
`;
