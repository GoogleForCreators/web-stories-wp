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

const CardGridItem = styled.div`
  margin: auto 0;
  height: ${({ theme }) => `${theme.grid.desktop.itemHeight}px`};
  width: ${({ theme }) => `${theme.grid.desktop.itemWidth}px`};
  display: flex;
  flex-direction: column;

  @media ${({ theme }) => theme.breakpoint.tablet} {
    height: ${({ theme }) => `${theme.grid.tablet.itemHeight}px`};
    width: ${({ theme }) => `${theme.grid.tablet.itemWidth}px`};
  }

  @media ${({ theme }) => theme.breakpoint.mobile} {
    height: ${({ theme }) => `${theme.grid.mobile.itemHeight}px`};
    width: ${({ theme }) => `${theme.grid.mobile.itemWidth}px`};
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    height: ${({ theme }) => `${theme.grid.min.itemHeight}px`};
    width: ${({ theme }) => `${theme.grid.min.itemWidth}px`};
  }
`;

export default CardGridItem;
export { default as CardPreviewContainer } from './card-preview';
export { default as CardTitle } from './card-title';
