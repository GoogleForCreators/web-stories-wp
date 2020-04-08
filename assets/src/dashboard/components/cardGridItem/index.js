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

/**
 * Internal dependencies
 */
import { MoreVerticalButton } from './cardItemMenu';

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

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    height: ${({ theme }) => `${theme.grid.largeDisplayPhone.itemHeight}px`};
    width: ${({ theme }) => `${theme.grid.largeDisplayPhone.itemWidth}px`};
  }

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    height: ${({ theme }) => `${theme.grid.smallDisplayPhone.itemHeight}px`};
    width: ${({ theme }) => `${theme.grid.smallDisplayPhone.itemWidth}px`};
    margin: auto;
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    height: ${({ theme }) => `${theme.grid.min.itemHeight}px`};
    width: ${({ theme }) => `${theme.grid.min.itemWidth}px`};
  }

  &:hover ${MoreVerticalButton}, &:active ${MoreVerticalButton} {
    opacity: 1;
  }
`;

export default CardGridItem;
export { default as CardPreviewContainer } from './cardPreview';
export { default as CardTitle } from './cardTitle';
export { default as CardItemMenu, MoreVerticalButton } from './cardItemMenu';
