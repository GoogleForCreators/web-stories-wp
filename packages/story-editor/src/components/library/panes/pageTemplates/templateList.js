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
import { useCallback, useMemo, useRef, useEffect } from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import { useVirtual } from 'react-virtual';
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import { UnitsProvider } from '@web-stories-wp/units';
import { useSnackbar } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { PANE_PADDING } from '../shared';
import {
  getVirtualizedItemIndex,
  useVirtualizedGridNavigation,
  VirtualizedContainer,
  PANEL_GRID_ROW_GAP,
  VirtualizedWrapper,
} from '../shared/virtualizedPanelGrid';
import { duplicatePage } from '../../../../elements';
import { useStory } from '../../../../app/story';
import PageTemplate from './pageTemplate';

const THRESHOLD = 6;
function TemplateList({
  pages,
  parentRef,
  pageSize,
  handleDelete,
  fetchTemplates,
  ...rest
}) {
  const { addPage } = useStory(({ actions }) => ({
    addPage: actions.addPage,
  }));
  const { showSnackbar } = useSnackbar();

  const containerRef = useRef();
  const pageRefs = useRef({});

  const pageIds = useMemo(() => pages?.map((page) => page.id) || [], [pages]);

  const handlePageClick = useCallback(
    (page) => {
      const duplicatedPage = duplicatePage(page);
      addPage({ page: duplicatedPage });
      trackEvent('insert_page_template', {
        name: page.title,
      });
      showSnackbar({
        message: __('Page Template added.', 'web-stories'),
        dismissable: true,
      });
    },
    [addPage, showSnackbar]
  );

  const rowsTotal = useMemo(() => Math.ceil((pages || []).length / 2), [pages]);

  const rowVirtualizer = useVirtual({
    size: rowsTotal,
    parentRef,
    estimateSize: useCallback(
      () => pageSize.containerHeight + PANEL_GRID_ROW_GAP,
      [pageSize.containerHeight]
    ),
    overscan: 4,
  });

  useEffect(() => {
    if (
      rowVirtualizer.virtualItems.length &&
      rowsTotal &&
      rowsTotal - THRESHOLD <
        rowVirtualizer.virtualItems[rowVirtualizer.virtualItems.length - 1]
          .index
    ) {
      fetchTemplates?.();
    }
  }, [rowVirtualizer, rowsTotal, fetchTemplates]);

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: 2,
    parentRef,
    estimateSize: useCallback(
      () => pageSize.width + PANEL_GRID_ROW_GAP,
      [pageSize.width]
    ),
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
                  {...rest}
                />
              );
            })
          )}
        </VirtualizedContainer>
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
  fetchTemplates: PropTypes.func,
};

export default TemplateList;
