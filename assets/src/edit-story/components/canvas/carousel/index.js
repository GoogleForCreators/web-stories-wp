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
import { rgba } from 'polished';
import { useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useFeatures } from 'flagged';

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
  Plain,
} from '../../button';
import {
  Reorderable,
  ReorderableSeparator,
  ReorderableItem,
} from '../../reorderable';
import Modal from '../../modal';
import GridView from '../gridview';
import PagePreview, {
  THUMB_FRAME_HEIGHT,
  THUMB_FRAME_WIDTH,
} from '../pagepreview';
import useResizeEffect from '../../../utils/useResizeEffect';
import {
  CAROUSEL_VERTICAL_PADDING,
  MIN_CAROUSEL_THUMB_HEIGHT,
  COMPACT_THUMB_HEIGHT,
  COMPACT_THUMB_WIDTH,
} from '../layout';
import { PAGE_WIDTH, PAGE_HEIGHT, SCROLLBAR_WIDTH } from '../../../constants';
import CompactIndicator from './compactIndicator';
import useCarouselKeys from './useCarouselKeys';

const CAROUSEL_BOTTOM_SCROLL_MARGIN = 8;

const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid: 'space prev-navigation carousel next-navigation menu' auto / 53px 53px 1fr 53px 53px;
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

const PlainStyled = styled(Plain)`
  background-color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.1)};
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.86)};
  &:hover {
    background-color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.25)};
  }
`;

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

const PageList = styled(Reorderable).attrs({
  area: 'carousel',
  role: 'listbox',
  'aria-orientation': 'horizontal',
})`
  flex-direction: row;
  align-items: center;
  justify-content: ${({ hasHorizontalOverflow }) =>
    hasHorizontalOverflow ? 'flex-start' : 'center'};
  overflow-x: auto;
  overflow-x: overlay;
  overflow-y: hidden;
  margin: 0 0 ${CAROUSEL_BOTTOM_SCROLL_MARGIN}px 0;
  padding: 0px 10px;

  /*
   * These overrides are an exception - generally scrollbars should all
   * look the same. We do this only here because this scrollbar is always visible.
   */
  scrollbar-color: ${({ theme }) => theme.colors.bg.v10}
    ${({ theme }) => theme.colors.bg.v1} !important;

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg.v1} !important;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid ${({ theme }) => theme.colors.bg.v1} !important;
    border-top-width: 3px !important;
  }
`;

const PageSeparator = styled(ReorderableSeparator)`
  position: absolute;
  bottom: 0;
  left: ${({ width }) => width / 2}px;
  width: ${({ width, margin }) => width + margin}px;
  height: ${({ height }) => height - THUMB_FRAME_HEIGHT}px;
  display: flex;
  justify-content: center;

  &:first-of-type {
    left: -${({ width, margin }) => (width + 2 * margin) / 2}px;
  }
`;

const Line = styled.div`
  background: ${({ theme }) => theme.colors.action};
  height: ${({ height }) => height - THUMB_FRAME_HEIGHT}px;
  width: 4px;
  margin: 0px;
`;

const ItemContainer = styled.div`
  display: flex;
  position: relative;
`;

const ReorderablePage = styled(ReorderableItem).attrs({ role: 'option' })`
  display: flex;
  z-index: 1;
  margin: 0 10px 0 0;
  &:last-of-type {
    margin: 0;
  }
`;

const GridViewContainer = styled.div`
  flex: 1;
  margin: 70px 170px 70px 170px;
  pointer-events: all;
`;

function calculateThumbnailHeight(carouselSize) {
  return (
    carouselSize.height -
    CAROUSEL_VERTICAL_PADDING * 2 -
    CAROUSEL_BOTTOM_SCROLL_MARGIN -
    THUMB_FRAME_HEIGHT
  );
}

function calculatePageThumbSize(carouselSize) {
  const aspectRatio = PAGE_WIDTH / PAGE_HEIGHT;
  const pageHeight = calculateThumbnailHeight(carouselSize);
  const pageWidth = pageHeight * aspectRatio;
  return [pageWidth + THUMB_FRAME_WIDTH, pageHeight + THUMB_FRAME_HEIGHT];
}

function Carousel() {
  const {
    pages,
    currentPageId,
    setCurrentPage,
    arrangePage,
  } = useStory(
    ({
      state: { pages, currentPageId },
      actions: { setCurrentPage, arrangePage },
    }) => ({ pages, currentPageId, setCurrentPage, arrangePage })
  );
  const { isRTL } = useConfig();
  const { showKeyboardShortcutsButton } = useFeatures();
  const [hasHorizontalOverflow, setHasHorizontalOverflow] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isGridViewOpen, setIsGridViewOpen] = useState(false);
  const listRef = useRef(null);
  const pageRefs = useRef([]);
  const wrapperRef = useRef(null);

  const [carouselSize, setCarouselSize] = useState({
    width: COMPACT_THUMB_WIDTH,
    height: COMPACT_THUMB_HEIGHT,
  });

  const isCompact =
    calculateThumbnailHeight(carouselSize) < MIN_CAROUSEL_THUMB_HEIGHT;

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
    const rect = listRef.current.getBoundingClientRect();
    setCarouselSize({ width: rect.width, height: rect.height });
  }, []);

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

  const Page = isCompact ? CompactIndicator : PagePreview;
  const [pageThumbWidth, pageThumbHeight] = useMemo(
    () => calculatePageThumbSize(carouselSize),
    [carouselSize]
  );
  const arrowsBottomMargin = isCompact
    ? CAROUSEL_BOTTOM_SCROLL_MARGIN + SCROLLBAR_WIDTH
    : CAROUSEL_BOTTOM_SCROLL_MARGIN;

  const rearrangePages = useCallback(
    (oldPos, newPos) => {
      if (isCompact) {
        return;
      }
      const pageId = pages[oldPos].id;
      arrangePage({ pageId, position: newPos });
      setCurrentPage({ pageId });
    },
    [pages, isCompact, arrangePage, setCurrentPage]
  );

  useCarouselKeys(wrapperRef, pageRefs, isRTL);

  return (
    <>
      <Wrapper ref={wrapperRef} data-testid="PageCarousel">
        <NavArea area="space" />
        <NavArea area="prev-navigation" marginBottom={arrowsBottomMargin}>
          <PrevButton
            isHidden={!hasHorizontalOverflow || isAtBeginningOfList}
            onClick={() => scrollBy(-scrollByPx)}
            width="24"
            height="24"
            aria-label={__('Scroll Backward', 'web-stories')}
          />
        </NavArea>
        <PageList
          ref={listRef}
          hasHorizontalOverflow={hasHorizontalOverflow}
          aria-label={__('Pages List', 'web-stories')}
          onPositionChange={rearrangePages}
          mode={'horizontal'}
          getItemSize={() => pageThumbWidth}
        >
          {pages.map((page, index) => {
            const isCurrentPage = page.id === currentPageId;
            const isInteractive = pages.length > 1;

            return (
              <ItemContainer
                key={page.id}
                ref={(el) => {
                  pageRefs.current[page.id] = el;
                }}
              >
                {index === 0 && (
                  <PageSeparator
                    position={0}
                    width={pageThumbWidth}
                    height={pageThumbHeight}
                    margin={10 /** px */}
                  >
                    <Line height={pageThumbHeight} />
                  </PageSeparator>
                )}
                <ReorderablePage position={index}>
                  <Page
                    onClick={handleClickPage(page)}
                    role="option"
                    ariaLabel={
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
                    isActive={isCurrentPage && isInteractive}
                    index={index}
                    width={pageThumbWidth}
                    height={pageThumbHeight}
                    isInteractive={isInteractive}
                  />
                </ReorderablePage>
                <PageSeparator
                  position={index + 1}
                  width={pageThumbWidth}
                  height={pageThumbHeight}
                  margin={10 /** px */}
                >
                  <Line height={pageThumbHeight} />
                </PageSeparator>
              </ItemContainer>
            );
          })}
        </PageList>
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
            {showKeyboardShortcutsButton && (
              <OverflowButtons>
                <KeyboardShortcutsButton
                  width="24"
                  height="24"
                  isDisabled
                  aria-label={__('Keyboard Shortcuts', 'web-stories')}
                />
              </OverflowButtons>
            )}
            <GridViewButton
              width="24"
              height="24"
              onClick={openModal}
              aria-label={__('Grid View', 'web-stories')}
            />
          </MenuIconsWrapper>
        </MenuArea>
      </Wrapper>
      <Modal
        open={isGridViewOpen}
        onClose={closeModal}
        contentLabel={__('Grid View', 'web-stories')}
        overlayStyles={{
          alignItems: 'flex-start',
        }}
        contentStyles={{
          pointerEvents: 'none',
          flex: 1,
        }}
      >
        <GridViewContainer>
          <PlainStyled onClick={() => closeModal()}>
            {__('Back', 'web-stories')}
          </PlainStyled>
          <GridView />
        </GridViewContainer>
      </Modal>
    </>
  );
}

export default Carousel;
