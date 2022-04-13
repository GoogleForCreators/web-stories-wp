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
import PropTypes from 'prop-types';
import { __, sprintf } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { ReorderableSeparator, ReorderableItem } from '../../reorderable';
import PagePreview from '../pagepreview';
import useCarousel from './useCarousel';
import { THUMBNAIL_LINE_WIDTH } from './constants';

const Line = styled.div`
  background: ${({ theme }) => theme.colors.border.selection};
  height: ${({ height }) => height}px;
  width: ${THUMBNAIL_LINE_WIDTH}px;
  margin: 0px;
`;

const ItemContainer = styled.li.attrs({ role: 'presentation' })`
  display: flex;
  position: relative;
  margin: 0;
  padding: 0;
`;

const PageSeparator = styled(ReorderableSeparator)`
  position: absolute;
  bottom: 0;
  left: ${({ width }) => width / 2}px;
  width: ${({ width, margin }) => width + margin}px;
  height: ${({ height }) => height}px;
  display: flex;
  justify-content: center;

  ${ItemContainer}:first-of-type &:first-of-type,
  ${ItemContainer}:last-of-type &:last-of-type {
    width: ${({ width, margin }) =>
      (width + margin + THUMBNAIL_LINE_WIDTH) / 2}px;
  }

  ${ItemContainer}:first-of-type &:first-of-type {
    left: ${({ margin }) => (margin - THUMBNAIL_LINE_WIDTH) / 2}px;
    justify-content: flex-start;
  }

  ${ItemContainer}:first-of-type &:last-of-type {
    left: ${({ width, margin }) => margin + width / 2}px;
  }

  ${ItemContainer}:last-of-type &:last-of-type {
    justify-content: flex-end;
  }
`;

const ReorderablePage = styled(ReorderableItem)`
  display: flex;
  z-index: 1;
  margin-right: ${({ margin }) => margin}px;
  margin-left: ${({ margin, position }) => (position === 0 ? margin : 0)}px;
`;

function CarouselPage({ pageId, index }) {
  const {
    pageThumbWidth,
    pageThumbHeight,
    pageThumbMargin,
    clickPage,
    setPageRef,
    page,
    isCurrentPage,
    hasMultiplePages,
  } = useCarousel(
    ({
      state: {
        pageThumbWidth,
        pageThumbHeight,
        pageThumbMargin,
        numPages,
        pages,
        currentPageId,
      },
      actions: { clickPage, setPageRef },
    }) => ({
      pageThumbWidth,
      pageThumbHeight,
      pageThumbMargin,
      clickPage,
      setPageRef,
      page: pages.find(({ id }) => id === pageId),
      isCurrentPage: pageId === currentPageId,
      hasMultiplePages: numPages > 1,
    })
  );

  if (!page || !page.id) {
    return null;
  }

  return (
    <ItemContainer
      ref={(el) => setPageRef(page, el)}
      data-testid={`carousel-page-preview-${pageId}`}
    >
      {index === 0 && (
        <PageSeparator
          position={0}
          width={pageThumbWidth}
          height={pageThumbHeight}
          margin={pageThumbMargin}
        >
          <Line height={pageThumbHeight} />
        </PageSeparator>
      )}
      <ReorderablePage position={index} margin={pageThumbMargin}>
        <PagePreview
          tabIndex={isCurrentPage && hasMultiplePages ? 0 : -1}
          onClick={() => clickPage(page)}
          role="option"
          data-page-id={page.id}
          label={
            isCurrentPage
              ? sprintf(
                  /* translators: %s: page number. */
                  __('Page %s (current page)', 'web-stories'),
                  index + 1
                )
              : sprintf(
                  /* translators: %s: page number. */
                  __('Go to page %s', 'web-stories'),
                  index + 1
                )
          }
          isActive={isCurrentPage}
          page={page}
          width={pageThumbWidth}
          height={pageThumbHeight}
          isInteractive={hasMultiplePages}
        />
      </ReorderablePage>
      <PageSeparator
        position={index + 1}
        width={pageThumbWidth}
        height={pageThumbHeight}
        margin={pageThumbMargin}
      >
        <Line height={pageThumbHeight} />
      </PageSeparator>
    </ItemContainer>
  );
}

CarouselPage.propTypes = {
  pageId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default CarouselPage;
