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
import { useStory } from '../../../../app';
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
  margin-top: 4px;
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

  const [selectedPage, setSelectedPage] = useState();
  const [activePageId, setActivePageId] = useState();
  const [isConfirming, setIsConfirming] = useState();
  const [isPageLayoutsFocused, setIsPageLayoutsFocused] = useState(false);

  const pageIds = useMemo(() => pages.map((page) => page.id), [pages]);

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

      setSelectedPage(null);
    },
    [replaceCurrentPage]
  );

  const handlePageClick = useCallback(
    (page) => {
      if (requiresConfirmation) {
        setIsConfirming(true);
        setSelectedPage(page);
      } else {
        handleApplyPageLayout(page);
        setSelectedPage(null);
      }
    },
    [requiresConfirmation, handleApplyPageLayout]
  );

  const handleKeyboardPageClick = useCallback(
    ({ key }, page) => {
      if (key === 'Enter') {
        if (isPageLayoutsFocused) {
          handlePageClick(page);
        }
      }
    },
    [isPageLayoutsFocused, handlePageClick]
  );

  const handleCloseDialog = useCallback(() => {
    setSelectedPage(null);
    setIsConfirming(false);
  }, [setIsConfirming]);

  const handleConfirmDialog = useCallback(() => {
    handleApplyPageLayout(selectedPage);
    setIsConfirming(false);
  }, [selectedPage, handleApplyPageLayout]);

  const handlePageFocus = useCallback(
    (pageId) => {
      if (activePageId !== pageId) {
        setActivePageId(pageId);
      }
    },
    [activePageId]
  );

  const rowVirtualizer = useVirtual({
    size: Math.ceil((pages || []).length / 2),
    parentRef,
    estimateSize: useCallback(
      () => pageSize.containerHeight + PAGE_LAYOUT_ROW_GAP,
      [pageSize.containerHeight]
    ),
    overscan: 4,
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

  /**
   * useVirtual and useRovingTabIndex do not play well together but we need both!
   * The Below useEffect is key to maintaining the proper focus for keyboard users.
   * What happens is on "scroll" of the virtualized container useVirtual is grabbing more rows
   * and these rows are fed through the rendered map to create page layouts that are visible to users.
   * While it doesn't look like the DOM is updating, it is in fact updating.
   * So the old refs get lost and the list gets new ones! By manually forcing focus and maintaining an object
   * of pageRefs that are organized by page id (those don't update) we can make sure the focus stays where it's supposed to be.
   * Checking for a difference in currentAvailableRows and assigning the matching ref to any change is just so that the effect hook will run when the virtualized list
   * updates and reattach focus to the new instance of an already selected layout.
   */
  const currentAvailableRows = useMemo(() => rowVirtualizer.virtualItems, [
    rowVirtualizer,
  ]);
  const currentAvailableRowsRef = useRef();

  useEffect(() => {
    if (currentAvailableRows !== currentAvailableRowsRef?.current) {
      currentAvailableRowsRef.current = currentAvailableRows;
    }

    if (activePageId && isPageLayoutsFocused) {
      pageRefs.current?.[activePageId]?.focus();
    }
  }, [activePageId, currentAvailableRows, isPageLayoutsFocused]);

  const handlePageLayoutFocus = useCallback(() => {
    if (!isPageLayoutsFocused) {
      const newPageId = pageRefs.current?.[activePageId]
        ? activePageId
        : pageIds[0];

      setActivePageId(newPageId);
      setIsPageLayoutsFocused(true);
      pageRefs.current?.[newPageId]?.focus();
    }
  }, [activePageId, isPageLayoutsFocused, pageIds]);

  useRovingTabIndex({ ref: containerRef });

  // Exit page layouts
  const focusCanvas = useFocusCanvas();

  const onTabKeyDown = useCallback(() => {
    focusCanvas();
    setIsPageLayoutsFocused(false);
  }, [focusCanvas]);

  useKeyDownEffect(containerRef, 'tab', onTabKeyDown, [onTabKeyDown]);

  useFocusOut(
    containerRef,
    () => {
      setIsPageLayoutsFocused(false);
    },
    [isConfirming]
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
          tab={0}
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
              const isActive = activePageId === page.id && isPageLayoutsFocused;

              return (
                <PageLayout
                  key={pageIndex}
                  ref={(el) => (pageRefs.current[page.id] = el)}
                  translateY={virtualRow.start}
                  translateX={virtualColumn.start}
                  page={page}
                  pageSize={pageSize}
                  isActive={isActive}
                  onFocus={() => handlePageFocus(page.id)}
                  onClick={() => handlePageClick(page)}
                  onKeyUp={(event) => handleKeyboardPageClick(event, page)}
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
