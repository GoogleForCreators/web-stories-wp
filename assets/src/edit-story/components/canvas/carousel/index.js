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
  Keyboard as KeyboardShortcutsButton,
} from '../../button';
import Modal from '../../modal';
import GridView from '../gridview';
import DraggablePage from '../draggablePage';
import useResizeEffect from '../../../utils/useResizeEffect';
import {
  COMPACT_CAROUSEL_BREAKPOINT,
  CAROUSEL_VERTICAL_PADDING,
} from '../layout';
import DropZoneProvider from '../../dropzone/dropZoneProvider';
import CompactIndicator from './compactIndicator';

const CAROUSEL_BOTTOM_SCROLL_MARGIN = 8;

const SCROLLBAR_HEIGHT = 8;

const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid: 'prev-navigation carousel next-navigation menu' auto / 53px 1fr 53px 53px;
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
`;

const NavArea = styled(Area)`
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
`;

const MenuArea = styled(Area).attrs({ area: 'menu' })``;

const MenuIconsWrapper = styled.div`
  ${({ isCompact }) =>
    isCompact
      ? css`
          margin-bottom: 16px;
        `
      : css`
          position: absolute;
          bottom: 44px;
        `}
`;

const OverflowButtons = styled.div`
  position: relative;
  & > * {
    position: absolute;
    bottom: 10px;
  }
`;

const List = styled(Area).attrs({
  area: 'carousel',
  as: 'ul',
  role: 'listbox',
})`
  flex-direction: row;
  align-items: center;
  justify-content: ${({ hasHorizontalOverflow }) =>
    hasHorizontalOverflow ? 'flex-start' : 'center'};
  overflow-x: scroll;
  overflow-y: hidden;
  margin: 0 0 ${CAROUSEL_BOTTOM_SCROLL_MARGIN}px 0;
  scrollbar-color: rgba(255, 255, 255, 0.54) transparent;
  scrollbar-width: auto;
  &::-webkit-scrollbar {
    width: ${SCROLLBAR_HEIGHT}px;
    height: ${SCROLLBAR_HEIGHT}px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.54);
    border-radius: ${SCROLLBAR_HEIGHT * 2}px;
  }
`;

const Li = styled.li`
  margin: 0 10px 0 0;
  &:last-of-type {
    margin: 0;
  }
`;

function calculatePageThumbSize(carouselSize) {
  const aspectRatio = 9 / 16;
  const availableHeight =
    carouselSize.height -
    CAROUSEL_VERTICAL_PADDING * 2 -
    CAROUSEL_BOTTOM_SCROLL_MARGIN;
  const height = availableHeight;
  const width = availableHeight * aspectRatio;
  return [width, height];
}

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

  const [carouselSize, setCarouselSize] = useState({});
  const isCompact = carouselSize.height < COMPACT_CAROUSEL_BREAKPOINT;

  const openModal = useCallback(() => setIsGridViewOpen(true), []);
  const closeModal = useCallback(() => setIsGridViewOpen(false), []);

  useResizeEffect(
    listRef,
    (currentCarouselSize) => {
      const { offsetWidth, scrollWidth, scrollLeft } = listRef.current;
      const max = scrollWidth - offsetWidth;
      setHasHorizontalOverflow(Math.ceil(scrollWidth) > Math.ceil(offsetWidth));
      setScrollPercentage(scrollLeft / max);
      setCarouselSize(currentCarouselSize);
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

  const scrollByPx = carouselSize.width;
  const isAtBeginningOfList = isRTL
    ? 1 === scrollPercentage
    : 0 === scrollPercentage;
  const isAtEndOfList = isRTL ? 0 === scrollPercentage : 1 === scrollPercentage;

  const PrevButton = isRTL ? RightArrow : LeftArrow;
  const NextButton = isRTL ? LeftArrow : RightArrow;

  const Item = isCompact ? CompactIndicator : DraggablePage;
  const [pageThumbWidth, pageThumbHeight] = calculatePageThumbSize(
    carouselSize
  );
  const arrowsBottomMargin = isCompact
    ? CAROUSEL_BOTTOM_SCROLL_MARGIN + SCROLLBAR_HEIGHT
    : CAROUSEL_BOTTOM_SCROLL_MARGIN;

  return (
    <DropZoneProvider>
      <Wrapper>
        <NavArea area="prev-navigation" marginBottom={arrowsBottomMargin}>
          <PrevButton
            isHidden={!hasHorizontalOverflow || isAtBeginningOfList}
            onClick={() => scrollBy(-scrollByPx)}
            width="24"
            height="24"
            aria-label={__('Scroll Backward', 'web-stories')}
          />
        </NavArea>
        <List ref={listRef} hasHorizontalOverflow={hasHorizontalOverflow}>
          {pages.map((page, index) => {
            const isCurrentPage = index === currentPageIndex;

            return (
              <Li key={index}>
                <Item
                  onClick={handleClickPage(page)}
                  dragIndicatorOffset={2}
                  role="option"
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
                  width={pageThumbWidth}
                  height={pageThumbHeight}
                />
              </Li>
            );
          })}
        </List>
        <NavArea area="next-navigation" marginBottom={arrowsBottomMargin}>
          <NextButton
            isHidden={!hasHorizontalOverflow || isAtEndOfList}
            onClick={() => scrollBy(scrollByPx)}
            width="24"
            height="24"
            aria-label={__('Scroll Forward', 'web-stories')}
          />
        </NavArea>
        <MenuArea>
          <MenuIconsWrapper isCompact={isCompact}>
            <OverflowButtons>
              <KeyboardShortcutsButton
                width="24"
                height="24"
                aria-label={__('Keyboard Shortcuts', 'web-stories')}
              />
            </OverflowButtons>
            <GridViewButton
              width="24"
              height="24"
              onClick={openModal}
              aria-label={__('Grid View', 'web-stories')}
            />
          </MenuIconsWrapper>
        </MenuArea>
      </Wrapper>
      {isGridViewOpen && (
        <Modal
          isOpen={isGridViewOpen}
          onRequestClose={closeModal}
          contentLabel={__('Grid View', 'web-stories')}
          closeButtonLabel={__('Back', 'web-stories')}
        >
          <GridView />
        </Modal>
      )}
    </DropZoneProvider>
  );
}

export default Carousel;
