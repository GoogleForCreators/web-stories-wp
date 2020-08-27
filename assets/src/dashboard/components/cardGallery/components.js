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

export const GalleryContainer = styled.div`
  ${({ maxWidth }) => `
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: ${maxWidth}px;
  `}
`;

export const MiniCardsContainer = styled.div`
  ${({ rowHeight, gap }) => `
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-auto-rows: ${rowHeight}px;
    grid-gap: ${gap}px;

  `}
`;

export const ItemContainer = styled.div`
  ${({ width }) => `
    display: flex;
    justify-content: space-around;
    width: ${width ? `${width}px` : '100%'};
  `}
`;

export const MiniCardButton = styled.button(
  ({ width, height, theme, isSelected }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
    padding: 0;
    background-color: transparent;
    border: ${
      isSelected ? theme.borders.bluePrimary : theme.borders.transparent
    };
    border-width: 2px; 
  `
);

export const MiniCard = styled.div(
  ({ width, theme }) => `
    position: relative;
    width: ${width}px;
    cursor: pointer;
    border: ${theme.storyPreview.border};
  `
);

export const ActiveCard = styled.div(
  ({ width, theme }) => `
    position: relative;
    box-sizing: border-box;
    width: ${width}px;
    border: ${theme.storyPreview.border};
    box-shadow: ${theme.storyPreview.shadow};
  `
);
