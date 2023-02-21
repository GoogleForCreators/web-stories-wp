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
import styled, { css } from 'styled-components';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { Reorderable } from '../../reorderable';
import CarouselPage from './carouselPage';
import SkeletonPage from './skeletonPage';
import { useCarousel } from './carouselContext';

const PageList = styled(Reorderable).attrs({
  role: 'listbox',
  'aria-orientation': 'horizontal',
  mode: 'horizontal',
})`
  grid-area: carousel;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: hidden;
  width: ${({ $width }) => $width}px;
  list-style: none;
  padding: 4px 0;
  margin: -4px 0;

  ${({ hasOverflow }) =>
    hasOverflow &&
    css`
      overflow-x: visible;
      overflow-x: overlay;
      justify-content: flex-start;
    `};

  ::-webkit-scrollbar-thumb {
    border: 6px solid transparent !important;
  }
`;

function CarouselList() {
  const {
    pageThumbWidth,
    carouselWidth,
    hasOverflow,
    pageIds,
    rearrangePages,
    setListRef,
    showSkeleton,
  } = useCarousel(
    ({
      state: {
        pageThumbWidth,
        carouselWidth,
        hasOverflow,
        pageIds,
        showSkeleton,
      },
      actions: { rearrangePages, setListRef },
    }) => ({
      pageThumbWidth,
      carouselWidth,
      hasOverflow,
      pageIds,
      rearrangePages,
      setListRef,
      showSkeleton,
    })
  );

  const Page = showSkeleton ? SkeletonPage : CarouselPage;

  return (
    <PageList
      mode="horizontal"
      $width={carouselWidth}
      ref={setListRef}
      hasOverflow={hasOverflow}
      aria-label={__('Pages List', 'web-stories')}
      onPositionChange={rearrangePages}
      getItemSize={() => pageThumbWidth}
    >
      {pageIds.map((pageId, index) => (
        <Page key={pageId} pageId={pageId} index={index} />
      ))}
    </PageList>
  );
}

export default CarouselList;
