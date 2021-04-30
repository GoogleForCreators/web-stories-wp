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
import { useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useVirtual } from 'react-virtual';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { UnitsProvider } from '../../../../units';
import { PANE_PADDING } from '../shared';
import {
  getVirtualizedItemIndex,
  useVirtualizedGridNavigation,
  VirtualizedContainer,
  PANEL_GRID_ROW_GAP,
  VirtualizedWrapper,
} from '../shared/virtualizedPanelGrid';
import PageTemplate from './pageTemplate';
import ConfirmPageTemplateDialog from './confirmPageTemplateDialog';
import useTemplateActions from './useTemplateActions';

function TemplateList({ pages, parentRef, pageSize, handleDelete }) {
  const containerRef = useRef();
  const pageRefs = useRef({});

  const pageIds = useMemo(() => pages.map((page) => page.id), [pages]);

  const {
    isConfirming,
    handleCloseDialog,
    handleConfirmDialog,
    handlePageClick,
  } = useTemplateActions();

  const rowVirtualizer = useVirtual({
    size: Math.ceil((pages || []).length / 2),
    parentRef,
    estimateSize: useCallback(
      () => pageSize.containerHeight + PANEL_GRID_ROW_GAP,
      [pageSize.containerHeight]
    ),
    overscan: 4,
  });

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: 2,
    parentRef,
    estimateSize: useCallback(() => pageSize.width + PANEL_GRID_ROW_GAP, [
      pageSize.width,
    ]),
    overscan: 0,
  });

  const {
    activeGridItemId,
    handleGridFocus,
    handleGridItemFocus,
    isGridFocused,
  } = useVirtualizedGridNavigation({
    rowVirtualizer,
    containerRef,
    gridItemRefs: pageRefs,
    gridItemIds: pageIds,
  });

  const handleKeyboardPageClick = useCallback(
    ({ code }, page) => {
      if (isGridFocused) {
        if (code === 'Enter') {
          handlePageClick(page);
        } else if (code === 'Space') {
          handleDelete?.(page);
        }
      }
    },
    [isGridFocused, handlePageClick, handleDelete]
  );

  return (
    <UnitsProvider
      pageSize={{
        width: pageSize.width,
        height: pageSize.height,
      }}
    >
      <VirtualizedWrapper height={rowVirtualizer.totalSize}>
        <VirtualizedContainer
          height={rowVirtualizer.totalSize}
          ref={containerRef}
          columnWidth={pageSize.width}
          rowHeight={pageSize.containerHeight}
          paneLeft={PANE_PADDING}
          onFocus={handleGridFocus}
          role="list"
          aria-label={__('Page Template Options', 'web-stories')}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) =>
            columnVirtualizer.virtualItems.map((virtualColumn) => {
              const pageIndex = getVirtualizedItemIndex({
                columnIndex: virtualColumn.index,
                rowIndex: virtualRow.index,
              });

              const page = pages[pageIndex];

              if (!page) {
                return null;
              }
              const isActive = activeGridItemId === page.id && isGridFocused;

              return (
                <PageTemplate
                  key={pageIndex}
                  data-testid={`page_template_${page.id}`}
                  ref={(el) => (pageRefs.current[page.id] = el)}
                  translateY={virtualRow.start}
                  translateX={virtualColumn.start}
                  page={page}
                  pageSize={pageSize}
                  isActive={isActive}
                  onFocus={() => handleGridItemFocus(page.id)}
                  onClick={() => handlePageClick(page)}
                  onKeyUp={(event) => handleKeyboardPageClick(event, page)}
                  handleDelete={handleDelete}
                />
              );
            })
          )}
        </VirtualizedContainer>
        {isConfirming && (
          <ConfirmPageTemplateDialog
            onConfirm={handleConfirmDialog}
            onClose={handleCloseDialog}
          />
        )}
      </VirtualizedWrapper>
    </UnitsProvider>
  );
}

TemplateList.propTypes = {
  parentRef: PropTypes.object.isRequired,
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
  pageSize: PropTypes.object.isRequired,
  handleDelete: PropTypes.func,
};

export default TemplateList;
