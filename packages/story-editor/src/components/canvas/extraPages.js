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
import styled from 'styled-components';
import { memo } from '@googleforcreators/react';
import { PAGE_RATIO } from '@googleforcreators/units';
import PropTypes from 'prop-types';
import { __, sprintf } from '@googleforcreators/i18n';
import { useTransform } from '@googleforcreators/transform';

/**
 * Internal dependencies
 */
import { useStory, useLayout } from '../../app';
import PagePreview from '../footer/pagepreview';

const GAP = 32;

const ExtraPageWrapper = styled.div`
  display: flex;
  overflow: hidden;
  justify-content: ${({ isPrevious }) =>
    isPrevious ? 'flex-end' : 'flex-start'};
  align-items: center;
  height: 100%;
`;
const ExtraPageList = styled.ol`
  display: flex;
  flex-direction: ${({ isPrevious }) => (isPrevious ? 'row-reverse' : 'row')};
  width: ${({ listWidth }) => listWidth}px;
  margin: 0;
  padding: 0 ${GAP}px;
  gap: ${GAP}px;
`;
const ExtraPage = styled.li`
  display: block;
  width: ${({ extraPageWidth }) => extraPageWidth - GAP}px;
  height: 100%;
  border-radius: 4px;
  background-color: white;

  /* First extra page is at 60% opacity, then 45, 30, and 15 */
  opacity: ${({ $distance }) => 0.6 - $distance * 0.15};
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 1;
  }

  ${({ $inert }) => $inert && 'pointer-events: none;'}
`;
const ExtraPagePreview = styled(PagePreview)`
  cursor: pointer;
`;

function range(from, to) {
  return from < to ? Array.from(Array(to - from)).map((k, v) => v + from) : [];
}

function getPagesToShow({
  isPrevious,
  hasExtraPages,
  currentPageIndex,
  extraPageCount,
  pageCount,
}) {
  if (!hasExtraPages) {
    return [];
  }
  // Showing pages before the current one
  if (isPrevious) {
    const from = Math.max(0, currentPageIndex - extraPageCount);
    const to = currentPageIndex;
    return range(from, to).reverse();
  }
  // Showing pages after the current one
  const from = currentPageIndex + 1;
  const to = Math.min(pageCount, currentPageIndex + extraPageCount + 2);
  return range(from, to);
}

function ExtraPages({ isPrevious = false }) {
  const { currentPageIndex, pages, setCurrentPage } = useStory(
    ({ state: { pages, currentPageIndex }, actions: { setCurrentPage } }) => ({
      currentPageIndex,
      pages,
      setCurrentPage,
    })
  );
  const { hasExtraPages, extraPageWidth, extraPageCount } = useLayout(
    ({ state: { hasExtraPages, extraPageWidth, extraPageCount } }) => ({
      hasExtraPages,
      extraPageWidth,
      extraPageCount,
    })
  );
  const isAnythingTransforming = useTransform(
    ({ state: { isAnythingTransforming } }) => isAnythingTransforming
  );

  const pageCount = pages?.length;
  if (!pageCount) {
    return null;
  }
  const pagesToShow = getPagesToShow({
    isPrevious,
    hasExtraPages,
    currentPageIndex,
    extraPageCount,
    pageCount,
  });
  if (pagesToShow.length === 0) {
    return null;
  }
  const listWidth = pagesToShow.length * extraPageWidth;
  const extraPageHeight = (extraPageWidth - GAP) / PAGE_RATIO;

  const clickPage = (pageId) => () => setCurrentPage({ pageId });

  return (
    <ExtraPageWrapper isPrevious={isPrevious}>
      <ExtraPageList
        isPrevious={isPrevious}
        listWidth={listWidth}
        extraPageHeight={extraPageHeight}
      >
        {pagesToShow.map((pageNum, index) => (
          <ExtraPage
            key={pageNum}
            extraPageWidth={extraPageWidth}
            $inert={isAnythingTransforming}
            $distance={index}
          >
            <ExtraPagePreview
              page={pages[pageNum]}
              onClick={clickPage(pages[pageNum].id)}
              aria-label={sprintf(
                /* translators: %s: page number. */
                __('Go to page %s', 'web-stories'),
                pageNum + 1
              )}
              width={extraPageWidth - GAP}
            />
          </ExtraPage>
        ))}
      </ExtraPageList>
    </ExtraPageWrapper>
  );
}

ExtraPages.propTypes = {
  isPrevious: PropTypes.bool,
};

export default memo(ExtraPages);
