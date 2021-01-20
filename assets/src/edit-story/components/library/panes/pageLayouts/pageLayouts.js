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
import { Fragment, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useVirtual } from 'react-virtual';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../../../../../design-system';
import { useStory } from '../../../../app';
import { PAGE_RATIO, FULLBLEED_RATIO } from '../../../../constants';
import { duplicatePage } from '../../../../elements';
import { UnitsProvider } from '../../../../units';
import isDefaultPage from '../../../../utils/isDefaultPage';
import { PANE_PADDING } from '../shared';
import PageLayout from './pageLayout';

const PAGE_LAYOUT_PANE_WIDTH = 158;
const PAGE_LAYOUT_ROW_GAP = 12;

const PageLayoutsContainer = styled.div`
  height: ${({ height }) => `${height}px`};
  width: 100%;
  position: relative;
`;

const PageLayoutsVirtualizedContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${PANE_PADDING};
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-columns: ${({ pageSize }) => `
    repeat(auto-fill, ${pageSize.width}px)`};
  grid-template-rows: ${({ pageSize }) =>
    `minmax(${pageSize.containerHeight}px, auto)`};
  gap: ${PAGE_LAYOUT_ROW_GAP}px;
  width: 100%;
  height: 100%;
`;

function PageLayouts(props) {
  const { pages, parentRef } = props;

  const { replaceCurrentPage, currentPage } = useStory(
    ({ actions: { replaceCurrentPage }, state: { currentPage } }) => ({
      replaceCurrentPage,
      currentPage,
    })
  );

  const containerRef = useRef();

  const handleApplyPageLayout = useCallback(
    (page) => {
      const duplicatedPage = duplicatePage(page);
      replaceCurrentPage({ page: duplicatedPage });
      trackEvent('insert_page_layout', {
        name: page.title,
      });
    },
    [replaceCurrentPage]
  );

  const pageSize = useMemo(() => {
    const width = PAGE_LAYOUT_PANE_WIDTH;
    const height = Math.round(width / PAGE_RATIO);
    const containerHeight = Math.round(width / FULLBLEED_RATIO);
    return { width, height, containerHeight };
  }, []);

  const rowVirtualizer = useVirtual({
    size: Math.ceil((pages || []).length / 2),
    parentRef,
    estimateSize: useCallback(
      () => pageSize.containerHeight + PAGE_LAYOUT_ROW_GAP,
      [pageSize.containerHeight]
    ),
    overscan: 2,
  });

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: 2,
    parentRef,
    estimateSize: useCallback(() => pageSize.width + PAGE_LAYOUT_ROW_GAP, [
      pageSize.width,
    ]),
    overscan: 0,
  });

  const requiresConfirmation = useMemo(
    () => currentPage && !isDefaultPage(currentPage),
    [currentPage]
  );

  const onTabKeyDown = useCallback(() => {
    // When page layouts is already in focus and tab is hit again we want to move focus out of the panel
    // This gets a little goofy because there's nothing else focusable left to go to in the page layouts tab
    // and if we back up without moving to the next sibling we'll never let the keyboard user continue through the page.
    if (parentRef.current) {
      const canvas =
        parentRef.current?.offsetParent?.offsetParent?.offsetParent?.nextSibling
          ?.firstChild;
      if (canvas) {
        canvas.tabIndex = 0;
        canvas.focus();
      }
    }
  }, [parentRef]);

  useKeyDownEffect(containerRef, 'tab', onTabKeyDown, [onTabKeyDown]);

  return (
    <UnitsProvider
      pageSize={{
        width: pageSize.width,
        height: pageSize.height,
      }}
    >
      <PageLayoutsContainer height={rowVirtualizer.totalSize}>
        <PageLayoutsVirtualizedContainer
          height={rowVirtualizer.totalSize}
          ref={containerRef}
          pageSize={pageSize}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <Fragment key={virtualRow.index}>
              {columnVirtualizer.virtualItems.map((virtualColumn) => {
                const pageIndex =
                  virtualColumn.index === 0
                    ? virtualRow.index * 2
                    : virtualRow.index * 2 + 1;
                const page = pages[pageIndex];

                if (!page) {
                  return null;
                }
                return (
                  <PageLayout
                    translateY={virtualRow.start}
                    translateX={virtualColumn.start}
                    key={page.id}
                    page={page}
                    pageSize={pageSize}
                    onConfirm={() => handleApplyPageLayout(page)}
                    requiresConfirmation={requiresConfirmation}
                  />
                );
              })}
            </Fragment>
          ))}
        </PageLayoutsVirtualizedContainer>
      </PageLayoutsContainer>
    </UnitsProvider>
  );
}

PageLayouts.propTypes = {
  parentRef: PropTypes.object.isRequired,
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
};

export default PageLayouts;
