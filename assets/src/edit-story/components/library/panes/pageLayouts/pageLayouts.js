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
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useVirtual } from 'react-virtual';

/**
 * Internal dependencies
 */
import { PANE_PADDING } from '../shared';
import { PAGE_RATIO } from '../../../../constants';
import PageLayout, {
  PAGE_LAYOUT_ROW_GAP,
  PAGE_LAYOUT_PANE_WIDTH,
} from './pageLayout';

const PageLayoutsContainer = styled.div`
  height: ${({ height }) => `${height}px`};
  width: 100%;
  margin-top: 28px;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
`;

const PageLayoutsRow = styled.div`
  position: absolute;
  top: 0;
  left: ${PANE_PADDING};
  height: ${({ height }) => `${height}px`};
  transform: ${({ translateY }) => `translateY(${translateY}px)`};
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 12px;
`;

function PageLayouts(props) {
  const { pages, paneRef } = props;

  const rowVirtualizer = useVirtual({
    size: Math.ceil(pages.length / 2),
    parentRef: paneRef,
    estimateSize: useCallback(
      () => PAGE_LAYOUT_PANE_WIDTH / PAGE_RATIO + PAGE_LAYOUT_ROW_GAP,
      []
    ),
    overscan: 5,
  });

  return (
    <PageLayoutsContainer height={rowVirtualizer.totalSize}>
      {rowVirtualizer.virtualItems.map((virtualRow) => {
        const firstColumnIndex = virtualRow.index * 2;
        const indexes = [firstColumnIndex, firstColumnIndex + 1];
        return (
          <PageLayoutsRow
            key={virtualRow.index}
            height={virtualRow.size}
            translateY={virtualRow.start}
          >
            {indexes.map((index) => {
              const page = pages[index];
              return page ? <PageLayout key={index} page={page} /> : null;
            })}
          </PageLayoutsRow>
        );
      })}
    </PageLayoutsContainer>
  );
}

PageLayouts.propTypes = {
  paneRef: PropTypes.object,
  pages: PropTypes.array,
};

export default PageLayouts;
