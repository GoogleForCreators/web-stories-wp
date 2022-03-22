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
import styled, { css } from 'styled-components';
import { forwardRef } from '@googleforcreators/react';
import { ThemeGlobals, themeHelpers } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { PageSizePropType } from '../../types';
import { GRID_SPACING } from '../../constants';

const DashboardGrid = styled.div`
  display: grid;
  width: 100%;
  grid-column-gap: ${GRID_SPACING.COLUMN_GAP}px;
  grid-row-gap: ${GRID_SPACING.ROW_GAP}px;
  grid-template-columns: ${({ columnWidth }) => `
    repeat(auto-fill, ${columnWidth}px)`};
  grid-template-rows: ${({ columnHeight }) =>
    `minmax(${columnHeight}px, auto)`};
  scroll-margin-top: 30vh;

  ${({ theme }) => css`
    &.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} {
      ${themeHelpers.focusCSS(theme.colors.border.focus)};
    }
  `};
`;
DashboardGrid.propTypes = {
  columnHeight: PropTypes.number,
  columnWidth: PropTypes.number,
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
      /* eslint-disable-next-line styled-components-a11y/no-noninteractive-tabindex --
       * We need to focus this div to engage with `useGridViewKeys`
       * which is critical to avoiding focus traps for keyboard users.
       **/
      tabIndex={0}
      aria-label={ariaLabel}
      columnWidth={pageSize.width}
      columnHeight={pageSize.height}
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
