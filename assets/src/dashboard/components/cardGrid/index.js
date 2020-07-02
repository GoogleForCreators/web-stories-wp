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

/**
 * Internal dependencies
 */
import { PageSizePropType } from '../../types';

const DashboardGrid = styled.div(
  ({ columnHeight, columnWidth, theme }) => `
  display: grid;
  width: 100%;
  grid-column-gap: ${theme.grid.columnGap.desktop}px;
  grid-row-gap: 20px;
  grid-template-columns:
    repeat(auto-fill, ${columnWidth}px);
  grid-template-rows: minmax(${columnHeight}px, auto);

  ${theme.breakpoint.tablet} {
    grid-column-gap: ${theme.grid.columnGap.tablet}px;
  }
  ${theme.breakpoint.largeDisplayPhone} {
    grid-column-gap: ${theme.grid.columnGap.largeDisplayPhone}px;
  }
  ${theme.breakpoint.smallDisplayPhone} {
    grid-column-gap: ${theme.grid.columnGap.smallDisplayPhone}px;
  }
  ${theme.breakpoint.min} {
    grid-column-gap: ${theme.grid.columnGap.min}px;
  }
`
);
DashboardGrid.propTypes = {
  columnHeight: PropTypes.number.isRequired,
  columnWidth: PropTypes.number.isRequired,
};

const CardGrid = ({ children, pageSize }) => (
  <DashboardGrid
    columnWidth={pageSize.width}
    columnHeight={pageSize.containerHeight}
  >
    {children}
  </DashboardGrid>
);

CardGrid.propTypes = {
  children: PropTypes.node.isRequired,
  pageSize: PageSizePropType.isRequired,
};

export default CardGrid;
