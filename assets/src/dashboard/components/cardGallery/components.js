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
import { themeHelpers } from '@web-stories-wp/design-system';

export const GalleryContainer = styled.div`
  ${({ maxWidth }) => `
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: ${maxWidth}px;
  `}
`;
GalleryContainer.propTypes = {
  maxWidth: PropTypes.number.isRequired,
};

export const MiniCardsContainer = styled.div`
  ${({ rowHeight, gap }) => `
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-auto-rows: ${rowHeight}px;
    grid-gap: ${gap}px;

  `}
`;
MiniCardsContainer.propTypes = {
  rowHeight: PropTypes.number.isRequired,
  gap: PropTypes.number.isRequired,
};

export const ItemContainer = styled.div`
  ${({ width }) => `
    display: flex;
    justify-content: space-around;
    width: ${width ? `${width}px` : '100%'};

  `}
`;
ItemContainer.propTypes = {
  width: PropTypes.number.isRequired,
};

export const MiniCardButton = styled.button(
  ({ width, height, theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    border: 0;
    background-color: transparent;
    border-radius: ${theme.borders.radius.small};
    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
  `
);
MiniCardButton.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
};

export const MiniCard = styled.div(
  ({ width, theme }) => `
    position: relative;
    width: ${width}px;
    cursor: pointer;
    border: 1px solid ${theme.colors.border.defaultNormal};
    border-radius: ${theme.borders.radius.small};
    overflow: hidden;

  `
);
MiniCard.propTypes = {
  width: PropTypes.number.isRequired,
};

export const ActiveCard = styled.div(
  ({ width, containerHeight, theme }) => `
    position: relative;
    width: ${width}px;
    overflow: hidden;
    height: ${containerHeight}px;
    border: 1px solid ${theme.colors.border.defaultNormal};
    border-radius: ${theme.borders.radius.small};
  `
);
ActiveCard.propTypes = {
  width: PropTypes.number.isRequired,
};
