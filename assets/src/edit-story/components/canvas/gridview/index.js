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
import { useState, useRef } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useConfig, useStory } from '../../../app';
import RangeInput from '../../rangeInput';
import { Rectangle as RectangleIcon } from '../../../icons';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../../constants';
import PagePreview, {
  THUMB_FRAME_HEIGHT,
  THUMB_FRAME_WIDTH,
} from '../pagepreview';
import {
  Reorderable,
  ReorderableSeparator,
  ReorderableItem,
} from '../../reorderable';
import useGridViewKeys from './useGridViewKeys';

const PREVIEW_WIDTH = 90;
const PREVIEW_HEIGHT = (PREVIEW_WIDTH * PAGE_HEIGHT) / PAGE_WIDTH;
const GRID_GAP = 20;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Wrapper = styled(Reorderable)`
  position: relative;
  overflow-y: auto;
  overflow-y: overlay;
  overflow-x: hidden;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Grid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: ${({ scale }) =>
    `repeat(auto-fit, minmax(${
      scale * PREVIEW_WIDTH + THUMB_FRAME_WIDTH
    }px, max-content))`};
  grid-gap: ${GRID_GAP}px;
  justify-content: center;
  justify-items: center;
  align-items: center;
  flex-grow: 1;
`;

const RangeInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 430px;
  margin: 0 auto 75px auto;
  width: 100%;
`;

const FlexGrowRangeInput = styled(RangeInput)`
  flex-grow: 1;
`;

const Rectangle = styled.button`
  border: 0;
  padding: 0;
  margin: 0;
  min-width: unset;
  background: transparent;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.fg.v1};

  &:active {
    outline: none;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.3;
  }

  svg {
    width: ${({ isLarge }) => (isLarge ? '20px' : '12px')};
    height: auto;
    shape-rendering: crispEdges; /* prevents issues with anti-aliasing */
  }
`;

const Space = styled.div`
  flex: 0 0 20px;
`;

const PageSeparator = styled(ReorderableSeparator)`
  position: absolute;
  bottom: 0;
  left: ${({ width }) => width / 2}px;
  width: ${({ width, margin }) => width + margin}px;
  height: ${({ height }) => height - THUMB_FRAME_HEIGHT}px;
  display: flex;
  justify-content: center;

  ${({ before, width, margin }) =>
    before &&
    `
      left: -${(width + 2 * margin) / 2}px;
    `}
`;

const Line = styled.div`
  background: ${({ theme }) => theme.colors.action};
  height: ${({ height }) => height - THUMB_FRAME_HEIGHT}px;
  width: 4px;
  margin: 0px;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

function ThumbnailSizeControl({ value, onChange }) {
  const max = 3;
  const min = 1;
  const step = 1;

  const updateRangeValue = (addition) => {
    onChange(Math.min(max, Math.max(min, value + addition)));
  };

  let valueText;
  switch (value) {
    case max:
      valueText = __('Large', 'web-stories');
      break;
    case min:
      valueText = __('Small', 'web-stories');
      break;
    default:
      valueText = __('Medium', 'web-stories');
      break;
  }

  return (
    <RangeInputWrapper>
      <Rectangle
        onClick={() => updateRangeValue(-step)}
        disabled={value === min}
        aria-label={__('Decrease thumbnail size', 'web-stories')}
      >
        <RectangleIcon />
      </Rectangle>
      <Space />
      <FlexGrowRangeInput
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(evt) => onChange(Number(evt.target.value))}
        thumbSize={24}
        aria-label={__('Thumbnail size', 'web-stories')}
        aria-valuetext={valueText}
      />
      <Space />
      <Rectangle
        isLarge
        onClick={() => updateRangeValue(step)}
        disabled={value === max}
        aria-label={__('Increase thumbnail size', 'web-stories')}
      >
        <RectangleIcon />
      </Rectangle>
    </RangeInputWrapper>
  );
}

ThumbnailSizeControl.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

function GridView() {
  const {
    pages,
    currentPageIndex,
    setCurrentPage,
    arrangePage,
  } = useStory(
    ({
      state: { pages, currentPageIndex },
      actions: { setCurrentPage, arrangePage },
    }) => ({ pages, currentPageIndex, setCurrentPage, arrangePage })
  );

  const { isRTL } = useConfig();
  const [zoomLevel, setZoomLevel] = useState(2);

  const width = zoomLevel * PREVIEW_WIDTH + THUMB_FRAME_WIDTH;
  const height = zoomLevel * PREVIEW_HEIGHT + THUMB_FRAME_HEIGHT;

  const handleClickPage = (page) => () => setCurrentPage({ pageId: page.id });

  const wrapperRef = useRef();
  const gridRef = useRef();
  const pageRefs = useRef({});

  useGridViewKeys(wrapperRef, gridRef, pageRefs, isRTL);

  return (
    <Container>
      <ThumbnailSizeControl value={zoomLevel} onChange={setZoomLevel} />
      <Wrapper
        aria-label={__('Pages List', 'web-stories')}
        ref={wrapperRef}
        onPositionChange={(oldPos, newPos) => {
          const pageId = pages[oldPos].id;
          arrangePage({ pageId, position: newPos });
          setCurrentPage({ pageId });
        }}
        mode={'grid'}
        getItemSize={() => height}
      >
        <Grid scale={zoomLevel} ref={gridRef}>
          {pages.map((page, index) => {
            const isCurrentPage = index === currentPageIndex;
            const isInteractive = pages.length > 1;

            return (
              <ItemContainer
                key={`page-${index}`}
                ref={(el) => {
                  pageRefs.current[page.id] = el;
                }}
              >
                <PageSeparator
                  position={index}
                  width={width}
                  height={height}
                  margin={GRID_GAP}
                  before
                >
                  <Line height={height} />
                </PageSeparator>
                <ReorderableItem position={index}>
                  <PagePreview
                    key={index}
                    aria-label={
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
                    isActive={isCurrentPage && isInteractive}
                    index={index}
                    width={width}
                    height={height}
                    dragIndicatorOffset={GRID_GAP / 2}
                    onClick={handleClickPage(page)}
                    isInteractive={isInteractive}
                  />
                </ReorderableItem>
                <PageSeparator
                  position={index + 1}
                  width={width}
                  height={height}
                  margin={GRID_GAP}
                >
                  <Line height={height} />
                </PageSeparator>
              </ItemContainer>
            );
          })}
        </Grid>
      </Wrapper>
    </Container>
  );
}

export default GridView;
