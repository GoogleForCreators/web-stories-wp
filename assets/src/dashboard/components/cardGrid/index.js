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
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CardGrid = styled.div`
  display: grid;
  width: 100%;
  align-content: space-between;

  grid-template-columns: ${({ theme }) =>
    `repeat(auto-fill, minmax(${theme.grid.desktop.itemWidth}px, ${theme.grid.desktop.fr}))`};
  grid-gap: ${({ theme }) => theme.grid.desktop.gap};

  @media ${({ theme }) => theme.breakpoint.tablet} {
    grid-template-columns: ${({ theme }) =>
      `repeat(auto-fill, minmax(${theme.grid.tablet.itemWidth}px, ${theme.grid.tablet.fr}))`};
    grid-gap: ${({ theme }) => theme.grid.tablet.gap};
  }
  @media ${({ theme }) => theme.breakpoint.mobile} {
    grid-template-columns: ${({ theme }) =>
      `repeat(auto-fill, minmax(${theme.grid.mobile.itemWidth}px, ${theme.grid.mobile.fr}))`};
    grid-gap: ${({ theme }) => theme.grid.mobile.gap};
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    grid-template-columns: ${({ theme }) =>
      `repeat(auto-fill, minmax(${theme.grid.min.itemWidth}px, ${theme.grid.min.fr}))`};
    grid-gap: ${({ theme }) => theme.grid.min.gap};
  }

  @media ${({ theme }) => theme.breakpoint.trueMobile} {
    grid-template-columns: ${({ theme }) => `repeat(2, ${theme.grid.min.fr})`};
    grid-gap: ${({ theme }) => theme.grid.trueMobile.gap};
  }
`;

CardGrid.propTypes = {
  children: PropTypes.node.isRequired,
};

export const StoryGrid = styled(CardGrid)`
  width: ${({ theme }) => `calc(100% - ${theme.pageGutter.desktop}px)`};

  @media ${({ theme }) => theme.breakpoint.min} {
    width: ${({ theme }) => `calc(100% - ${theme.pageGutter.min}px)`};
  }
`;

export default CardGrid;
