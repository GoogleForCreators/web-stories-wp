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
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useVirtual } from 'react-virtual';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useFocusOut, useKeyDownEffect } from '../../../../../design-system';
import { useConfig, useStory } from '../../../../app';
import { PAGE_RATIO, FULLBLEED_RATIO } from '../../../../constants';
import { duplicatePage } from '../../../../elements';
import useRovingTabIndex from '../../../../utils/useRovingTabIndex';

import { UnitsProvider } from '../../../../units';
import isDefaultPage from '../../../../utils/isDefaultPage';
import useFocusCanvas from '../../../canvas/useFocusCanvas';
import { PANE_PADDING } from '../shared';
import PageLayout from './pageLayout';
import ConfirmPageLayoutDialog from './confirmPageLayoutDialog';

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

function PageLayouts({ pages, parentRef }) {
  const { replaceCurrentPage, currentPage } = useStory(
    ({ actions: { replaceCurrentPage }, state: { currentPage } }) => ({
      replaceCurrentPage,
      currentPage,
    })
  );

  const containerRef = useRef();
  const pageRefs = useRef({});
  // Used to indicate focus is new to page layouts
  const isNewFocusRef = useRef(false);

  const [activePageId, setActivePageId] = useState();
  const [activePage, setActivePage] = useState();
  const pageIds = useMemo(() => pages.map((page) => page.id), [pages]);

  const [isConfirming, setIsConfirming] = useState();

  const requiresConfirmation = useMemo(
    () => currentPage && !isDefaultPage(currentPage),
    [currentPage]
  );

  const pageSize = useMemo(() => {
    const width = PAGE_LAYOUT_PANE_WIDTH;
    const height = Math.round(width / PAGE_RATIO);
    const containerHeight = Math.round(width / FULLBLEED_RATIO);
    return { width, height, containerHeight };
  }, []);

  const handleApplyPageLayout = useCallback(
    (page) => {
      const duplicatedPage = duplicatePage(page);
      replaceCurrentPage({ page: duplicatedPage });
      trackEvent('insert_page_layout', {
        name: page.title,
      });

      setActivePage(null);
    },
    [replaceCurrentPage]
  );

  const handlePageClick = useCallback(
    (page) => {
      if (requiresConfirmation) {
        console.log('requires confirm');
        setIsConfirming(true);
        setActivePage(page);
      } else {
        handleApplyPageLayout(page);
        setActivePage(null);
      }
    },
    [requiresConfirmation, handleApplyPageLayout]
  );

  const handleCloseDialog = useCallback(
    (event) => {
      console.log('close event?', event);
      event.stopPropagation();
      setIsConfirming(false);
      setActivePage(null);
    },
    [setIsConfirming]
  );

  const handleConfirmDialog = useCallback(
    (event) => {
      console.log('confirm event ', event);
      event.preventDefault();
      event.stopPropagation();
      handleApplyPageLayout(activePage);
      setIsConfirming(false);
    },
    [activePage, handleApplyPageLayout]
  );

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

  // this is how we make sure the proper ref is focused when more rows are loaded
  // otherwise focus gets thrown off
  // checking for a difference in currentAvailableRows and assigning the matching ref to any change
  // is just so that the effect hook will run when the virtualized list updates and reattach focus to the new instance
  // of an already selected layout.
  const currentAvailableRows = useMemo(() => rowVirtualizer.virtualItems, [
    rowVirtualizer,
  ]);
  const currentAvailableRowsRef = useRef();

  useEffect(() => {
    if (currentAvailableRows !== currentAvailableRowsRef?.current) {
      currentAvailableRowsRef.current = currentAvailableRows;
    }

    activePageId && pageRefs.current?.[activePageId]?.focus();
  }, [activePageId, currentAvailableRows]);

  const handlePageLayoutFocus = useCallback(() => {
    if (!isNewFocusRef?.current) {
      console.log('initial set ', activePageId);
      const newPageId = pageRefs.current?.[activePageId]
        ? activePageId
        : pageIds[0];
      setActivePageId(newPageId);
      // TODO is this necessary?
      pageRefs.current?.[newPageId]?.focus();

      isNewFocusRef.current = true;
    }
  }, [activePageId, pageIds]);

  useRovingTabIndex({ ref: containerRef });

  // Exit page layouts, resets
  const focusCanvas = useFocusCanvas();

  const onTabKeyDown = useCallback(() => {
    console.log('tab');
    focusCanvas();
    isNewFocusRef.current = false;
  }, [focusCanvas]);

  useKeyDownEffect(containerRef, 'tab', onTabKeyDown, [onTabKeyDown]);

  useFocusOut(
    containerRef,
    () => {
      console.log('FOCUS OUT');
      isNewFocusRef.current = false;
    },
    []
  );

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
          // tabIndex={0}
          onFocus={handlePageLayoutFocus}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) =>
            columnVirtualizer.virtualItems.map((virtualColumn) => {
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
                  key={pageIndex}
                  ref={(el) => (pageRefs.current[page.id] = el)}
                  translateY={virtualRow.start}
                  translateX={virtualColumn.start}
                  page={page}
                  pageSize={pageSize}
                  isActive={activePageId === page.id && isNewFocusRef?.current}
                  onBlur={() => {}}
                  onFocus={() => {
                    if (activePageId !== page.id) {
                      setActivePageId(page.id);
                    }
                  }}
                  onClick={() => handlePageClick(page)}
                  onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                      // todo double check these are needed
                      event.preventDefault();
                      event.stopPropagation();
                      if (isNewFocusRef?.current) {
                        handlePageClick(page);
                      }
                    }
                  }}
                />
              );
            })
          )}
        </PageLayoutsVirtualizedContainer>
        {isConfirming && (
          <ConfirmPageLayoutDialog
            onConfirm={handleConfirmDialog}
            onClose={handleCloseDialog}
          />
        )}
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
