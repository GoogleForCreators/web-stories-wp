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
import PropTypes from 'prop-types'; // import styled from 'styled-components';
import styled from 'styled-components';

/**
 * Internal dependencies
 */

const GridContainer = styled.div`
  display: grid;
  width: ${({ theme }) => theme.grid.desktop.width};
  grid-template-columns: repeat(
    ${({ theme }) => theme.grid.desktop.columns},
    1fr
  );
  grid-gap: ${({ theme }) => theme.grid.desktop.gap};

  @media ${({ theme }) => theme.breakpoint.tablet} {
    width: ${({ theme }) => theme.grid.tablet.width};
    grid-template-columns: repeat(
      ${({ theme }) => theme.grid.tablet.columns},
      1fr
    );
    grid-gap: ${({ theme }) => theme.grid.tablet.gap};
  }

  @media ${({ theme }) => theme.breakpoint.mobile} {
    width: ${({ theme }) => theme.grid.mobile.width};
    grid-template-columns: repeat(
      ${({ theme }) => theme.grid.mobile.columns},
      1fr
    );
    grid-gap: ${({ theme }) => theme.grid.mobile.gap};
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    width: ${({ theme }) => theme.grid.min.width};
    grid-template-columns: repeat(
      ${({ theme }) => theme.grid.min.columns},
      1fr
    );
    grid-gap: ${({ theme }) => theme.grid.min.gap};
  }
`;

const CardGrid = ({ children, ...rest }) => {
  return <GridContainer {...rest}>{children}</GridContainer>;
};

CardGrid.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CardGrid;
