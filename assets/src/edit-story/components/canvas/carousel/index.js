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
import { useLayoutEffect, useRef, useState, useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useConfig, useStory } from '../../../app';
import {
  LeftArrow,
  RightArrow,
  GridView as GridViewButton,
} from '../../button';
import Modal from '../../modal';
import GridView from '../gridview';
import DraggablePage from '../draggablePage';
import useResizeEffect from '../../../utils/useResizeEffect';

// @todo: Make responsive. Blocked on the header reimplementation and
// responsive "page" size.
const PAGE_THUMB_HEIGHT = 50;
const PAGE_THUMB_WIDTH = (PAGE_THUMB_HEIGHT * 9) / 16;

const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid: 'prev-navigation carousel next-navigation' auto / 53px 1fr 53px;
  background-color: ${({ theme }) => theme.colors.bg.v1};
  color: ${({ theme }) => theme.colors.fg.v1};
  width: 100%;
  height: 100%;
`;

const Area = styled.div`
  grid-area: ${({ area }) => area};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 16px 0 24px;
`;

const List = styled(Area)`
  flex-direction: row;
  align-items: flex-start;
  justify-content: ${({ hasHorizontalOverflow }) =>
    hasHorizontalOverflow ? 'flex-start' : 'center'};
  overflow-x: ${({ hasHorizontalOverflow }) =>
    hasHorizontalOverflow ? 'scroll' : 'hidden'};
`;

const StyledGridViewButton = styled(GridViewButton)`
  position: absolute;
  bottom: 24px;
`;

function Carousel() {
  const {
    state: { pages, currentPageIndex, currentPageId },
    actions: { setCurrentPage },
  } = useStory();
  const { isRTL } = useConfig();
  const [hasHorizontalOverflow, setHasHorizontalOverflow] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isGridViewOpen, setIsGridViewOpen] = useState(false);
  const listRef = useRef(null);
  const pageRefs = useRef([]);

  const openModal = useCallback(() => setIsGridViewOpen(true), [
    setIsGridViewOpen,
  ]);
  const closeModal = useCallback(() => setIsGridViewOpen(false), [
    setIsGridViewOpen,
  ]);

  useResizeEffect(
    listRef,
    () => {
      const { offsetWidth, scrollWidth, scrollLeft } = listRef.current;
      const max = scrollWidth - offsetWidth;
      setHasHorizontalOverflow(Math.ceil(scrollWidth) > Math.ceil(offsetWidth));
      setScrollPercentage(scrollLeft / max);
    },
    [pages.length]
  );

  useLayoutEffect(() => {
    if (hasHorizontalOverflow) {
      const currentPageRef = pageRefs.current[currentPageId];

      if (!currentPageRef || !currentPageRef.scrollIntoView) {
        return;
      }

      currentPageRef.scrollIntoView({
        inline: 'center',
        behavior: 'smooth',
      });
    }
  }, [currentPageId, hasHorizontalOverflow, pageRefs]);

  useLayoutEffect(() => {
    const listElement = listRef.current;

    const handleScroll = () => {
      const { offsetWidth, scrollLeft, scrollWidth } = listElement;
      const max = scrollWidth - offsetWidth;
      setScrollPercentage(scrollLeft / max);
    };

    listElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      listElement.removeEventListener('scroll', handleScroll);
    };
  }, [hasHorizontalOverflow]);

  const handleClickPage = (page) => () => setCurrentPage({ pageId: page.id });

  const scrollBy = useCallback(
    (offset) => {
      if (isRTL) {
        offset *= -1;
      }

      if (!listRef.current.scrollBy) {
        listRef.current.scrollLeft += offset;
        return;
      }

      listRef.current.scrollBy({
        left: offset,
        behavior: 'smooth',
      });
    },
    [listRef, isRTL]
  );

  const isAtBeginningOfList = isRTL
    ? 1 === scrollPercentage
    : 0 === scrollPercentage;
  const isAtEndOfList = isRTL ? 0 === scrollPercentage : 1 === scrollPercentage;

  const PrevButton = isRTL ? RightArrow : LeftArrow;
  const NextButton = isRTL ? LeftArrow : RightArrow;

  return (
    <>
      <Wrapper>
        <Area area="prev-navigation">
          <PrevButton
            isHidden={!hasHorizontalOverflow || isAtBeginningOfList}
            onClick={() => scrollBy(-2 * PAGE_THUMB_WIDTH)}
            width="24"
            height="24"
            aria-label={__('Scroll Backward', 'web-stories')}
          />
        </Area>
        <List
          area="carousel"
          ref={listRef}
          hasHorizontalOverflow={hasHorizontalOverflow}
        >
          {pages.map((page, index) => {
            const isCurrentPage = index === currentPageIndex;

            return (
              <DraggablePage
                key={index}
                onClick={handleClickPage(page)}
                ariaLabel={
                  isCurrentPage
                    ? sprintf(
                        __('Page %s (current page)', 'web-stories'),
                        index + 1
                      )
                    : sprintf(__('Go to page %s', 'web-stories'), index + 1)
                }
                isActive={isCurrentPage}
                pageIndex={index}
                ref={(el) => {
                  pageRefs.current[page.id] = el;
                }}
                width={PAGE_THUMB_WIDTH}
                height={PAGE_THUMB_HEIGHT}
              />
            );
          })}
        </List>
        <Area area="next-navigation">
          <NextButton
            isHidden={!hasHorizontalOverflow || isAtEndOfList}
            onClick={() => scrollBy(2 * PAGE_THUMB_WIDTH)}
            width="24"
            height="24"
            aria-label={__('Scroll Forward', 'web-stories')}
          />
          <StyledGridViewButton
            width="24"
            height="24"
            onClick={openModal}
            aria-label={__('Grid View', 'web-stories')}
          />
        </Area>
      </Wrapper>
      <Modal
        isOpen={isGridViewOpen}
        onRequestClose={closeModal}
        contentLabel={__('Grid View', 'web-stories')}
        closeButtonLabel={__('Back', 'web-stories')}
      >
        <GridView />
      </Modal>
    </>
  );
}

export default Carousel;
