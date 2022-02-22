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
import {
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { useVirtual } from 'react-virtual';
import { __ } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
import { UnitsProvider } from '@googleforcreators/units';
import { useSnackbar } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { PANE_PADDING } from '../shared';
import {
  getVirtualizedItemIndex,
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

  const handlePageClick = useCallback(
    ({ templateId, version, title, ...page }) => {
      // Just using destructuring above so we don't pass unnecessary props to addPage().
      const duplicatedPage = duplicatePage(page);
      addPage({ page: duplicatedPage });
      trackEvent('insert_page_template', {
        name: title || 'custom', // Custom page templates don't have titles (yet).
      });
      showSnackbar({
        message: __('Page Template added.', 'web-stories'),
        dismissible: true,
      });
    },
    [addPage, showSnackbar]
  );

  const rowsTotal = useMemo(() => Math.ceil((pages || []).length / 2), [pages]);

  const rowVirtualizer = useVirtual({
    size: rowsTotal,
    parentRef,
    estimateSize: useCallback(
      () => pageSize.height + PANEL_GRID_ROW_GAP,
      [pageSize.height]
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
          rowHeight={pageSize.height}
          paneLeft={PANE_PADDING}
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

              return (
                <PageTemplate
                  key={pageIndex}
                  data-testid={`page_template_${page.id}`}
                  ref={(el) => (pageRefs.current[page.id] = el)}
                  translateY={virtualRow.start}
                  translateX={virtualColumn.start}
                  page={page}
                  pageSize={pageSize}
                  onClick={() => handlePageClick(page)}
                  handleDelete={handleDelete}
                  index={pageIndex}
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
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
    })
  ),
  pageSize: PropTypes.object.isRequired,
  handleDelete: PropTypes.func,
  fetchTemplates: PropTypes.func,
};

export default TemplateList;
