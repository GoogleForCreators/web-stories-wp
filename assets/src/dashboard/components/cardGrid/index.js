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
  max-width: ${({ theme }) => `${theme.breakpoint.raw.desktop}px`};
  grid-template-columns: ${({ theme }) =>
    `repeat(${theme.grid.desktop.columns},
    ${theme.grid.desktop.fr})`};
  grid-gap: ${({ theme }) => theme.grid.desktop.gap};

  @media ${({ theme }) => theme.breakpoint.tablet} {
    grid-template-columns: ${({ theme }) =>
      `repeat(${theme.grid.tablet.columns},
    ${theme.grid.tablet.fr})`};
    grid-gap: ${({ theme }) => theme.grid.tablet.gap};
  }

  @media ${({ theme }) => theme.breakpoint.mobile} {
    grid-template-columns: ${({ theme }) =>
      `repeat(${theme.grid.mobile.columns},
    ${theme.grid.mobile.fr})`};
    grid-gap: ${({ theme }) => theme.grid.mobile.gap};
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    grid-template-columns: ${({ theme }) =>
      `repeat(${theme.grid.min.columns},
    ${theme.grid.min.fr})`};
    grid-gap: ${({ theme }) => theme.grid.min.gap};
  }
`;

CardGrid.propTypes = {
  children: PropTypes.node.isRequired,
};

export const StoryGrid = styled(CardGrid)`
  grid-column-gap: 24px;
  grid-row-gap: 24px;
  margin: 20px;
`;

export default CardGrid;
