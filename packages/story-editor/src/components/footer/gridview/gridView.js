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
import {
  useState,
  useRef,
  useCallback,
  useResizeEffect,
} from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import { PAGE_RATIO } from '@googleforcreators/units';
import {
  Slider,
  Button,
  BUTTON_TYPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Icons,
  useGridViewKeys,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig, useStory } from '../../../app';
import {
  Reorderable,
  ReorderableSeparator,
  ReorderableItem,
} from '../../reorderable';
import PagePreview from '../pagepreview';
import { Z_INDEX_GRID_VIEW_SLIDER } from '../../../constants/zIndex';

const MIN_GRID_GAP = 20;
const LINE_HEIGHT = 64;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 32px;
`;

const TopRow = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
  @media ${({ theme }) => theme.breakpoint.desktop} {
    margin-bottom: 72px;
  }
  @media ${({ theme }) => theme.breakpoint.wide} {
    margin-bottom: 112px;
  }
`;

const Wrapper = styled(Reorderable)`
  position: relative;
  overflow-y: auto;
  overflow-y: overlay;
  overflow-x: hidden;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  pointer-events: all;
  padding: 4px;
`;

const Grid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: ${({ pageWidth }) =>
    `repeat(auto-fit, minmax(${pageWidth}px, max-content))`};
  grid-template-rows: repeat(auto-fill, ${({ pageHeight }) => pageHeight}px);
  grid-gap: ${({ gapWidth }) => gapWidth}px;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
`;

const NoButton = styled.div`
  flex: 0 0 56px;
`;

const ClickableButton = styled(Button)`
  pointer-events: all;
`;

const ClickableSlider = styled(Slider)`
  pointer-events: all;
  width: 366px;
`;

const PageSeparator = styled(ReorderableSeparator)`
  position: absolute;
  bottom: 0;
  left: ${({ width }) => width / 2}px;
  width: ${({ width, margin }) => width + margin}px;
  height: ${({ height }) => height}px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ before, width, margin }) =>
    before &&
    `
      left: -${(width + 2 * margin) / 2}px;
    `}
`;

const Line = styled.div`
  background: ${({ theme }) => theme.colors.border.selection};
  height: ${({ height }) => height}px;
  width: 2px;
  margin: 0px;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

function GridView({ onClose }) {
  const {
    pages,
    currentPageId,
    currentPageIndex,
    setCurrentPage,
    arrangePage,
  } = useStory(
    ({
      state: { pages, currentPageIndex, currentPageId },
      actions: { setCurrentPage, arrangePage },
    }) => ({
      pages,
      currentPageIndex,
      currentPageId,
      setCurrentPage,
      arrangePage,
    })
  );

  const { isRTL } = useConfig();
  const [pagesPerRow, setPagesPerRow] = useState(4);
  const [availableWidth, setAvailableWidth] = useState(null);
  const wrapperRef = useRef();

  // Get updated size of wrapper
  useResizeEffect(wrapperRef, ({ width }) => setAvailableWidth(width), []);

  // Calculate max page width that can fit on the page
  const minGaps = MIN_GRID_GAP * (pagesPerRow - 1);
  const rawPageWidth = (availableWidth - minGaps) / pagesPerRow;

  const pageWidth = Math.floor(rawPageWidth / 12) * 12;
  const actualPageWidths = pageWidth * pagesPerRow;
  const pageGridGap = Math.floor(
    (availableWidth - actualPageWidths) / (pagesPerRow - 1)
  );
  const pageHeight = pageWidth / PAGE_RATIO;

  const handleClickPage = (page) => () => setCurrentPage({ pageId: page.id });

  const gridRef = useRef();
  const pageRefs = useRef({});

  const arrangeItem = useCallback(
    (focusedPageId, nextIndex) => {
      arrangePage({ pageId: focusedPageId, position: nextIndex });
    },
    [arrangePage]
  );

  useGridViewKeys({
    containerRef: wrapperRef,
    gridRef,
    itemRefs: pageRefs,
    isRTL,
    currentItemId: currentPageId,
    items: pages,
    arrangeItem,
  });

  // actual divider height should be smaller than page height, but no more than LINE_HEIGHT
  const dividerLineHeight = Math.min(pageHeight - 24, LINE_HEIGHT);

  return (
    <Container aria-label={__('Grid View', 'web-stories')}>
      <TopRow>
        <ClickableButton
          variant={BUTTON_VARIANTS.SQUARE}
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.MEDIUM}
          onClick={onClose}
          aria-label={__('Close', 'web-stories')}
        >
          <Icons.Cross />
        </ClickableButton>
        <ClickableSlider
          min={4}
          max={12}
          majorStep={1}
          minorStep={1}
          value={pagesPerRow}
          handleChange={(newValue) => setPagesPerRow(newValue)}
          aria-label={__('Pages per row', 'web-stories')}
          popupZIndexOverride={Z_INDEX_GRID_VIEW_SLIDER}
        />
        <NoButton />
      </TopRow>
      <Wrapper
        aria-label={__('Grid View Pages List', 'web-stories')}
        ref={wrapperRef}
        onPositionChange={(oldPos, newPos) => {
          const pageId = pages[oldPos].id;
          arrangePage({ pageId, position: newPos });
          setCurrentPage({ pageId });
        }}
        mode={'grid'}
        getItemSize={() => pageHeight}
        scrollSize={64}
      >
        <Grid
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          gapWidth={pageGridGap}
          ref={gridRef}
        >
          {pages.map((page, index) => {
            const isCurrentPage = index === currentPageIndex;
            const isInteractive = pages.length > 1;

            return (
              <ItemContainer
                key={page.id}
                ref={(el) => {
                  pageRefs.current[page.id] = el;
                }}
              >
                <PageSeparator
                  position={index}
                  width={pageWidth}
                  height={pageHeight}
                  margin={pageGridGap}
                  before
                >
                  <Line height={dividerLineHeight} />
                </PageSeparator>
                <ReorderableItem position={index}>
                  <PagePreview
                    key={page.id}
                    label={
                      isCurrentPage
                        ? sprintf(
                            /* translators: %s: page number. */
                            __('Page %s (current page)', 'web-stories'),
                            index + 1
                          )
                        : sprintf(
                            /* translators: %s: page number. */
                            __('Page %s', 'web-stories'),
                            index + 1
                          )
                    }
                    tabIndex={isCurrentPage && isInteractive ? 0 : -1}
                    isActive={isCurrentPage && isInteractive}
                    page={page}
                    width={pageWidth}
                    height={pageHeight}
                    onClick={handleClickPage(page)}
                    isInteractive={isInteractive}
                    gridRef={gridRef}
                    role="option"
                  />
                </ReorderableItem>
                <PageSeparator
                  position={index + 1}
                  width={pageWidth}
                  height={pageHeight}
                  margin={pageGridGap}
                >
                  <Line height={dividerLineHeight} />
                </PageSeparator>
              </ItemContainer>
            );
          })}
        </Grid>
      </Wrapper>
    </Container>
  );
}

GridView.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default GridView;
