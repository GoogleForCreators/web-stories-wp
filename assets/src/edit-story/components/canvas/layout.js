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
import { forwardRef, createRef } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  FULLBLEED_RATIO,
  PAGE_RATIO,
  ALLOWED_EDITOR_PAGE_WIDTHS,
  HEADER_HEIGHT,
  PAGE_NAV_WIDTH,
} from '../../constants';
import pointerEventsCss from '../../utils/pointerEventsCss';
import useResizeEffect from '../../utils/useResizeEffect';
import generatePatternStyles from '../../utils/generatePatternStyles';
import useCanvas from './useCanvas';

/**
 * @file See https://user-images.githubusercontent.com/726049/72654503-bfffe780-3944-11ea-912c-fc54d68b6100.png
 * for the layering details.
 */

export const Z_INDEX = {
  NAV: 2,
  EDIT: 3,
};

const MENU_HEIGHT = 48;

export const CAROUSEL_VERTICAL_PADDING = 24;
export const COMPACT_CAROUSEL_VERTICAL_PADDING = 32;

export const COMPACT_THUMB_WIDTH = 72;
export const COMPACT_THUMB_HEIGHT = 8;

const MAX_CAROUSEL_THUMB_HEIGHT = 128;
export const MIN_CAROUSEL_THUMB_HEIGHT = 52;

const MIN_CAROUSEL_HEIGHT =
  COMPACT_CAROUSEL_VERTICAL_PADDING * 2 + COMPACT_THUMB_HEIGHT;
const MAX_CAROUSEL_HEIGHT =
  MAX_CAROUSEL_THUMB_HEIGHT + CAROUSEL_VERTICAL_PADDING * 2;

// @todo: the menu height is not responsive
const Layer = styled.section`
  ${pointerEventsCss}

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  ${({ zIndex }) => (typeof zIndex === 'number' ? `z-index: ${zIndex};` : '')}

  display: grid;
  grid:
    'head      head      head      head      head    ' ${HEADER_HEIGHT}px
    '.         .         .         .         .       ' minmax(16px, 1fr)
    '.         prev      page      next      .       ' var(
      --fullbleed-height-px
    )
    '.         .         menu      .         .       ' ${MENU_HEIGHT}px
    '.         .         .         .         .       ' 1fr
    'carousel  carousel  carousel  carousel  carousel' minmax(
      ${MIN_CAROUSEL_HEIGHT}px,
      ${MAX_CAROUSEL_HEIGHT}px
    )
    / 1fr ${PAGE_NAV_WIDTH}px var(--fullbleed-width-px)
    ${PAGE_NAV_WIDTH}px 1fr;
  height: 100%;
`;

const Area = styled.div`
  ${pointerEventsCss}

  grid-area: ${({ area }) => area};
  overflow: ${({ overflowAllowed }) =>
    overflowAllowed ? 'visible' : 'hidden'};
  position: relative;
  width: 100%;
  height: 100%;
  ${({ zIndex }) => (zIndex !== undefined ? `z-index: ${zIndex}` : null)};
`;

// Page area is not `overflow:hidden` by default to allow different clipping
// mechanisms.
const PageAreaFullbleedContainer = styled(Area).attrs({
  area: 'page',
  overflowAllowed: true,
})`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Overflow is not hidden for media edit layer.
const PageAreaWithOverflow = styled.div`
  ${({ background }) => generatePatternStyles(background)}
  overflow: ${({ showOverflow }) => (showOverflow ? 'initial' : 'hidden')};
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageAreaSafeZone = styled.div`
  width: 100%;
  height: var(--page-height-px);
  overflow: visible;
  position: relative;
  margin: auto 0;
`;

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
 * @param {!{current: ?Element}} containerRef Container reference.
 */
function useLayoutParams(containerRef) {
  const { setPageSize } = useCanvas((state) => ({
    setPageSize: state.actions.setPageSize,
  }));

  useResizeEffect(containerRef, ({ width, height }) => {
    // See Layer's `grid` CSS above. Per the layout, the maximum available
    // space for the page is:
    const maxWidth = width - PAGE_NAV_WIDTH * 2;
    const maxHeight =
      height - HEADER_HEIGHT - MENU_HEIGHT - MIN_CAROUSEL_HEIGHT;

    let bestSize =
      ALLOWED_EDITOR_PAGE_WIDTHS.find(
        (size) => size <= maxWidth && size / FULLBLEED_RATIO <= maxHeight
      ) || ALLOWED_EDITOR_PAGE_WIDTHS[ALLOWED_EDITOR_PAGE_WIDTHS.length - 1];
    setPageSize({ width: bestSize, height: bestSize / PAGE_RATIO });
  });
}

function useLayoutParamsCssVars() {
  const { pageSize } = useCanvas((state) => ({
    pageSize: state.state.pageSize,
  }));
  return {
    '--page-width-px': `${pageSize.width}px`,
    '--page-height-px': `${pageSize.height}px`,
    '--fullbleed-width-px': `${pageSize.width}px`,
    '--fullbleed-height-px': `${pageSize.width / FULLBLEED_RATIO}px`,
  };
}

const PageArea = forwardRef(function PageArea(
  {
    children,
    showOverflow = false,
    fullbleedRef = createRef(),
    overlay = [],
    background,
  },
  ref
) {
  return (
    <PageAreaFullbleedContainer
      ref={fullbleedRef}
      data-testid="fullbleed"
      aria-label={__('Fullbleed area', 'web-stories')}
      role="region"
    >
      <PageAreaWithOverflow showOverflow={showOverflow} background={background}>
        <PageAreaSafeZone ref={ref} data-testid="safezone">
          {children}
        </PageAreaSafeZone>
      </PageAreaWithOverflow>
      {overlay}
    </PageAreaFullbleedContainer>
  );
});

PageArea.propTypes = {
  children: PropTypes.node,
  showOverflow: PropTypes.bool,
  fullbleedRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  overlay: PropTypes.node,
  background: PropTypes.object,
};

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
