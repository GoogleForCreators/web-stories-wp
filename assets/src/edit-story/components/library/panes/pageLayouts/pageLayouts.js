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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useVirtual } from 'react-virtual';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { PANE_PADDING } from '../shared';
import { PAGE_RATIO, FULLBLEED_RATIO } from '../../../../constants';
import { UnitsProvider } from '../../../../units';
import { useConfig, useStory } from '../../../../app';
import { duplicatePage } from '../../../../elements';
import isDefaultPage from '../../../../utils/isDefaultPage';
import useFocusOut from '../../../../utils/useFocusOut';
import { useKeyDownEffect } from '../../../keyboard';
import PageLayout from './pageLayout';
const PAGE_LAYOUT_PANE_WIDTH = 158;
const PAGE_LAYOUT_ROW_GAP = 12;

const PageLayoutsContainer = styled.div`
  height: ${({ height }) => `${height}px`};
  width: 100%;
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
  const { pages, parentRef } = props;

  const { replaceCurrentPage, currentPage } = useStory(
    ({ actions: { replaceCurrentPage }, state: { currentPage } }) => ({
      replaceCurrentPage,
      currentPage,
    })
  );

  const { isRTL } = useConfig();
  const pageRefs = useRef({});
  const containerRef = useRef();
  const [activePageId, setActivePageId] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const pageIds = useMemo(() => pages.map((page) => page.id), [pages]);
  const pageIdCount = pageIds.length - 1;

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
    size: Math.ceil(pages.length / 2),
    parentRef,
    estimateSize: useCallback(
      () => pageSize.containerHeight + PAGE_LAYOUT_ROW_GAP,
      [pageSize.containerHeight]
    ),
    overscan: 2,
  });

  const requiresConfirmation = useMemo(
    () => currentPage && !isDefaultPage(currentPage),
    [currentPage]
  );

  const onKeyDown = useCallback(
    (event) => {
      const { key } = event;
      if (!pageRefs.current) {
        return;
      }

      const currentIndex = pageIds.indexOf(activePageId);

      let newIndex;
      // page layouts are in 2 columns.
      if (key === 'ArrowUp') {
        newIndex = currentIndex - 2;
      } else if (key === 'ArrowDown') {
        newIndex = currentIndex + 2;
      } else if ([isRTL ? 'ArrowRight' : 'ArrowLeft'].includes(key)) {
        newIndex = currentIndex - 1;
      } else if ([isRTL ? 'ArrowLeft' : 'ArrowRight'].includes(key)) {
        newIndex = currentIndex + 1;
      }

      if (newIndex > -1 && newIndex <= pageIdCount) {
        setActivePageId(pageIds[newIndex]);
      }
    },
    [activePageId, pageIds, isRTL, pageIdCount]
  );

  useKeyDownEffect(
    containerRef,
    { key: ['left', 'right', 'down', 'up'] },
    onKeyDown,
    [onKeyDown]
  );

  useFocusOut(
    containerRef,
    () => {
      setIsFocused(false);
      setActivePageId(null);
    },
    []
  );

  useEffect(() => {
    if (activePageId) {
      const nextPage = pageRefs.current?.[activePageId];
      if (nextPage) {
        nextPage.tabIndex = 0;
        nextPage.focus();
      }
    }
  }, [activePageId]);

  useEffect(() => {
    if (isFocused && !activePageId) {
      setActivePageId(pageIds?.[0]);
    }
  }, [activePageId, isFocused, pageIds]);

  return (
    <UnitsProvider
      pageSize={{
        width: pageSize.width,
        height: pageSize.height,
      }}
    >
      <PageLayoutsContainer
        height={rowVirtualizer.totalSize}
        ref={containerRef}
        tabIndex={0}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
      >
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
                if (!page) {
                  return null;
                }
                return (
                  <PageLayout
                    key={page.id}
                    isFocused={activePageId === page.id}
                    page={page}
                    pageSize={pageSize}
                    onConfirm={() => handleApplyPageLayout(page)}
                    requiresConfirmation={requiresConfirmation}
                    ref={(el) => (pageRefs.current[page.id] = el)}
                  />
                );
              })}
            </PageLayoutsRow>
          );
        })}
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
