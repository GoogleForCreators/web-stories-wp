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

/**
 * Internal dependencies
 */
import {
  DEFAULT_EDITOR_PAGE_WIDTH,
  DEFAULT_EDITOR_PAGE_HEIGHT,
  HEADER_HEIGHT,
  PAGE_NAV_WIDTH,
} from '../../constants';
import pointerEventsCss from '../../utils/pointerEventsCss';
import useResizeEffect from '../../utils/useResizeEffect';
import useCanvas from './useCanvas';

/**
 * @file See https://user-images.githubusercontent.com/726049/72654503-bfffe780-3944-11ea-912c-fc54d68b6100.png
 * for the layering details.
 */

const MENU_HEIGHT = 48;

export const CAROUSEL_VERTICAL_PADDING = 24;
export const COMPACT_CAROUSEL_VERTICAL_PADDING = 32;

export const COMPACT_THUMB_WIDTH = 72;
export const COMPACT_THUMB_HEIGHT = 8;

const MAX_CAROUSEL_THUMB_HEIGHT = 128;
// @todo: UX needed for min thumb size
export const MIN_CAROUSEL_THUMB_HEIGHT = MAX_CAROUSEL_THUMB_HEIGHT / 3;

// Below this available height switch to Compact mode.
export const COMPACT_CAROUSEL_BREAKPOINT =
  MIN_CAROUSEL_THUMB_HEIGHT + CAROUSEL_VERTICAL_PADDING * 2;

const MIN_CAROUSEL_HEIGHT =
  COMPACT_CAROUSEL_VERTICAL_PADDING * 2 + COMPACT_THUMB_HEIGHT;
const MAX_CAROUSEL_HEIGHT =
  MAX_CAROUSEL_THUMB_HEIGHT + CAROUSEL_VERTICAL_PADDING * 2;

const LARGE_EDITOR_PAGE_SIZE = [
  DEFAULT_EDITOR_PAGE_WIDTH,
  DEFAULT_EDITOR_PAGE_HEIGHT,
];
const MEDIUM_EDITOR_PAGE_SIZE = [280, 420];
const SMALL_EDITOR_PAGE_SIZE = [240, 360];
const ALLOWED_PAGE_SIZES = [
  LARGE_EDITOR_PAGE_SIZE,
  MEDIUM_EDITOR_PAGE_SIZE,
  SMALL_EDITOR_PAGE_SIZE,
];

// @todo: the menu height is not responsive
const Layer = styled.div`
  ${pointerEventsCss}

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: grid;
  grid:
    'head      head      head      head      head    ' ${HEADER_HEIGHT}px
    '.         .         .         .         .       ' minmax(16px, 1fr)
    '.         prev      page      next      .       ' var(--page-height-px)
    '.         .         menu      .         .       ' ${MENU_HEIGHT}px
    '.         .         .         .         .       ' 1fr
    'carousel  carousel  carousel  carousel  carousel' minmax(
      ${MIN_CAROUSEL_HEIGHT}px,
      ${MAX_CAROUSEL_HEIGHT}px
    )
    / 1fr ${PAGE_NAV_WIDTH}px var(--page-width-px) ${PAGE_NAV_WIDTH}px 1fr;
`;

const Area = styled.div`
  ${pointerEventsCss}

  grid-area: ${({ area }) => area};
  overflow: ${({ overflowAllowed }) =>
    overflowAllowed ? 'visible' : 'hidden'};
  position: relative;
  width: 100%;
  height: 100%;
`;

// Page area is not `overflow:hidden` by default to allow different clipping
// mechanisms.
const PageArea = styled(Area).attrs({ area: 'page', overflowAllowed: true })``;

const HeadArea = styled(Area).attrs({ area: 'head', overflowAllowed: false })``;

const MenuArea = styled(Area).attrs({ area: 'menu', overflowAllowed: false })``;

const NavArea = styled(Area).attrs({ overflowAllowed: false })`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavPrevArea = styled(NavArea).attrs({ area: 'prev' })``;

const NavNextArea = styled(NavArea).attrs({ area: 'next' })``;

const CarouselArea = styled(Area).attrs({
  area: 'carousel',
  overflowAllowed: true,
})``;

/**
 * @param {!{current: ?Element}} containerRef
 */
function useLayoutParams(containerRef) {
  const {
    actions: { setPageSize },
  } = useCanvas();

  useResizeEffect(containerRef, ({ width, height }) => {
    // See Layer's `grid` CSS above. Per the layout, the maximum available
    // space for the page is:
    const maxWidth = width - PAGE_NAV_WIDTH * 2;
    const maxHeight =
      height - HEADER_HEIGHT - MENU_HEIGHT - MIN_CAROUSEL_HEIGHT;

    // Find the first size that fits within the [maxWidth, maxHeight].
    let bestSize = ALLOWED_PAGE_SIZES[ALLOWED_PAGE_SIZES.length - 1];
    for (let i = 0; i < ALLOWED_PAGE_SIZES.length; i++) {
      const size = ALLOWED_PAGE_SIZES[i];
      if (size[0] <= maxWidth && size[1] <= maxHeight) {
        bestSize = size;
        break;
      }
    }
    setPageSize({ width: bestSize[0], height: bestSize[1] });
  });
}

function useLayoutParamsCssVars() {
  const {
    state: { pageSize },
  } = useCanvas();
  return {
    '--page-width-px': `${pageSize.width}px`,
    '--page-height-px': `${pageSize.height}px`,
  };
}

export {
  Layer,
  PageArea,
  HeadArea,
  MenuArea,
  NavPrevArea,
  NavNextArea,
  CarouselArea,
  useLayoutParams,
  useLayoutParamsCssVars,
};
