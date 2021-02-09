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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Reorderable } from '../reorderable';
import CarouselPage from './carouselPage';
import useCarousel from './useCarousel';

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
  width: ${({ width }) => width}px;
  margin: 0;
  list-style: none;
  padding: 8px 0 16px;

  ${({ hasOverflow }) =>
    hasOverflow &&
    css`
      overflow-x: visible;
      overflow-x: overlay;
      justify-content: flex-start;
      /*
       * These overrides are an exception - generally scrollbars should all
       * look the same. We do this only here because this scrollbar is always visible
       * if scroll is possible.
       */
      scrollbar-color: ${({ theme }) => theme.colors.bg.v10}
        ${({ theme }) => theme.colors.bg.workspace} !important;

      &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.bg.workspace} !important;
      }

      &::-webkit-scrollbar-thumb {
        border: 2px solid ${({ theme }) => theme.colors.bg.workspace} !important;
        border-top-width: 3px !important;
      }
    `};
`;

function CarouselList() {
  const {
    pageThumbWidth,
    carouselWidth,
    hasOverflow,
    pageIds,
    rearrangePages,
    setListRef,
  } = useCarousel(
    ({
      state: { pageThumbWidth, carouselWidth, hasOverflow, pageIds },
      actions: { rearrangePages, setListRef },
    }) => ({
      pageThumbWidth,
      carouselWidth,
      hasOverflow,
      pageIds,
      rearrangePages,
      setListRef,
    })
  );

  return (
    <PageList
      mode="horizontal"
      width={carouselWidth}
      ref={setListRef}
      hasOverflow={hasOverflow}
      aria-label={__('Pages List', 'web-stories')}
      onPositionChange={rearrangePages}
      getItemSize={() => pageThumbWidth}
    >
      {pageIds.map((pageId, index) => (
        <CarouselPage key={pageId} pageId={pageId} index={index} />
      ))}
    </PageList>
  );
}

export default CarouselList;
