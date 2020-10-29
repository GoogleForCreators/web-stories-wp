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
import { rgba } from 'polished';
import { forwardRef } from 'react';

/**
 * Internal dependencies
 */
import { PageSizePropType } from '../../types';
import { KEYBOARD_USER_SELECTOR } from '../../constants';

const DashboardGrid = styled.div(
  ({ columnHeight, columnWidth, theme }) => `
  display: grid;
  width: 100%;
  grid-column-gap: ${theme.internalTheme.grid.columnGap.desktop}px;
  grid-row-gap: 80px;
  grid-template-columns:
    repeat(auto-fill, ${columnWidth}px);
  grid-template-rows: minmax(${columnHeight}px, auto);
  scroll-margin-top: 30vh;
  margin-top: 2px; // this is for keyboard focus 

  ${theme.internalTheme.breakpoint.tablet} {
    grid-column-gap: ${theme.internalTheme.grid.columnGap.tablet}px;
  }
  ${theme.internalTheme.breakpoint.largeDisplayPhone} {
    grid-column-gap: ${theme.internalTheme.grid.columnGap.largeDisplayPhone}px;
  }
  ${theme.internalTheme.breakpoint.smallDisplayPhone} {
    grid-column-gap: ${theme.internalTheme.grid.columnGap.smallDisplayPhone}px;
  }
  ${theme.internalTheme.breakpoint.min} {
    grid-column-gap: ${theme.internalTheme.grid.columnGap.min}px;
  }
  
  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: 2px solid ${rgba(
      theme.internalTheme.colors.bluePrimary,
      0.85
    )} !important; 
  }
`
);
DashboardGrid.propTypes = {
  columnHeight: PropTypes.number.isRequired,
  columnWidth: PropTypes.number.isRequired,
};

const CardGrid = forwardRef(function CardGrid(
  { ariaLabel, children, pageSize },
  ref
) {
  return (
    <DashboardGrid
      ref={ref}
      role="list"
      data-testid={'dashboard-grid-list'}
      tabIndex={0}
      aria-label={ariaLabel}
      columnWidth={pageSize.width}
      columnHeight={pageSize.containerHeight}
    >
      {children}
    </DashboardGrid>
  );
});

CardGrid.propTypes = {
  ariaLabel: PropTypes.string,
  children: PropTypes.node.isRequired,
  pageSize: PageSizePropType.isRequired,
};

export default CardGrid;
