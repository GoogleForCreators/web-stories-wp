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
import PropTypes from 'prop-types';
import { forwardRef, createRef } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useResizeEffect } from '../../../design-system';
import {
  FULLBLEED_RATIO,
  HEADER_HEIGHT,
  PAGE_NAV_WIDTH,
  SCROLLBAR_WIDTH,
} from '../../constants';
import pointerEventsCss from '../../utils/pointerEventsCss';
import generatePatternStyles from '../../utils/generatePatternStyles';
import { useLayout } from '../../app';
import {
  PAGEMENU_HEIGHT,
  PAGEMENU_MARGIN_TOP,
  PAGEMENU_MARGIN_BOTTOM,
} from './pagemenu';

/**
 * @file See https://user-images.githubusercontent.com/726049/72654503-bfffe780-3944-11ea-912c-fc54d68b6100.png
 * for the layering details.
 */

export const Z_INDEX = {
  NAV: 2,
  EDIT: 3,
};

const HEADER_GAP = 16;
const MENU_HEIGHT = PAGEMENU_HEIGHT + PAGEMENU_MARGIN_TOP;
const MENU_GAP = PAGEMENU_MARGIN_BOTTOM;
const CAROUSEL_HEIGHT = 104;

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
    '.         .         .         .         .       ' minmax(
      ${HEADER_GAP}px,
      1fr
    )
    '.         prev      page      next      .       ' var(--viewport-height-px)
    'menu      menu      menu      menu      menu    ' ${MENU_HEIGHT}px
    '.         .         .         .         .       ' minmax(
      ${MENU_GAP}px,
      1fr
    )
    'carousel  carousel  carousel  carousel  carousel' ${CAROUSEL_HEIGHT}px
    /
    1fr
    var(--page-nav-width)
    var(--viewport-width-px)
    var(--page-nav-width)
    1fr;
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
})`
  overflow: ${({ hideScrollbars }) =>
    hideScrollbars ? 'hidden' : 'var(--overflow-x) var(--overflow-y)'};

  &::-webkit-scrollbar,
  &::-webkit-scrollbar-corner {
    background-color: ${({ theme }) => theme.colors.bg.workspace};
  }
`;

const ZOOM_PADDING = '72px';
const PaddedPage = styled.div`
  width: calc(
    var(--page-width-px) +
      ${({ addMargin }) => (addMargin ? ZOOM_PADDING : '0')}
  );
  height: calc(
    var(--fullbleed-height-px) +
      ${({ addMargin }) => (addMargin ? ZOOM_PADDING : '0')}
  );
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Overflow is not hidden for media edit layer.
const PageAreaWithOverflow = styled.div`
  ${({ background }) => generatePatternStyles(background)}
  overflow: ${({ showOverflow }) => (showOverflow ? 'initial' : 'hidden')};
  position: relative;
  width: var(--page-width-px);
  height: var(--fullbleed-height-px);
  border-radius: 4px;

  ${({ isControlled }) =>
    isControlled &&
    css`
      left: var(--scroll-left-px);
      top: var(--scroll-top-px);
    `};
`;

const PageAreaSafeZone = styled.div`
  width: var(--page-width-px);
  height: var(--page-height-px);
  overflow: visible;
  position: relative;
  margin: auto 0;
  top: calc((var(--fullbleed-height-px) - var(--page-height-px)) / 2);
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
  const { setWorkspaceSize } = useLayout(
    ({ actions: { setWorkspaceSize } }) => ({
      setWorkspaceSize,
    })
  );

  useResizeEffect(containerRef, ({ width, height }) => {
    // See Layer's `grid` CSS above. Per the layout, the maximum available
    // space for the page is:
    const maxWidth = width;
    const maxHeight =
      height -
      HEADER_HEIGHT -
      HEADER_GAP -
      MENU_HEIGHT -
      MENU_GAP -
      CAROUSEL_HEIGHT;

    setWorkspaceSize({ width: maxWidth, height: maxHeight });
  });
}

function useLayoutParamsCssVars() {
  const {
    pageWidth,
    pageHeight,
    workspaceWidth,
    workspaceHeight,
    hasPageNavigation,
    hasVerticalOverflow,
    hasHorizontalOverflow,
    scrollLeft,
    scrollTop,
  } = useLayout(
    ({
      state: {
        pageWidth,
        pageHeight,
        workspaceWidth,
        workspaceHeight,
        hasPageNavigation,
        hasVerticalOverflow,
        hasHorizontalOverflow,
        scrollLeft,
        scrollTop,
      },
    }) => ({
      pageWidth,
      pageHeight,
      workspaceWidth,
      workspaceHeight,
      hasPageNavigation,
      hasVerticalOverflow,
      hasHorizontalOverflow,
      scrollLeft,
      scrollTop,
    })
  );
  const fullHeight = pageWidth / FULLBLEED_RATIO;
  const widthPadding = hasVerticalOverflow ? SCROLLBAR_WIDTH : 0;
  const viewportWidth = hasHorizontalOverflow
    ? workspaceWidth
    : pageWidth + widthPadding;
  const viewportHeight = hasVerticalOverflow ? workspaceHeight : fullHeight;
  // We need to make sure the element is correctly placed when there's no horizontal
  // scroll. By not setting an explicit width, we can ensure that.
  return {
    '--page-nav-width': `${hasPageNavigation ? PAGE_NAV_WIDTH : 0}px`,
    '--page-width-px': `${pageWidth}px`,
    '--page-height-px': `${pageHeight}px`,
    '--fullbleed-height-px': `${fullHeight}px`,
    '--viewport-width-px': `${viewportWidth}px`,
    '--viewport-height-px': `${viewportHeight}px`,
    '--overflow-x': hasHorizontalOverflow ? 'scroll' : 'hidden',
    '--overflow-y': hasVerticalOverflow ? 'scroll' : 'hidden',
    '--scroll-left-px': `-${scrollLeft}px`,
    '--scroll-top-px': `-${scrollTop}px`,
  };
}

const PageArea = forwardRef(function PageArea(
  {
    children,
    showOverflow = false,
    fullbleedRef = createRef(),
    overlay = [],
    background,
    isControlled = false,
    hideScrollbars = false,
    className = '',
  },
  ref
) {
  const { hasVerticalOverflow, hasHorizontalOverflow } = useLayout(
    ({ state: { hasVerticalOverflow, hasHorizontalOverflow } }) => ({
      hasVerticalOverflow,
      hasHorizontalOverflow,
    })
  );

  return (
    <PageAreaFullbleedContainer
      ref={fullbleedRef}
      data-testid="fullbleed"
      aria-label={__('Fullbleed area', 'web-stories')}
      role="region"
      hideScrollbars={hideScrollbars}
      className={className}
    >
      <PaddedPage addMargin={hasHorizontalOverflow && hasVerticalOverflow}>
        <PageAreaWithOverflow
          showOverflow={showOverflow}
          background={background}
          isControlled={isControlled}
        >
          <PageAreaSafeZone ref={ref} data-testid="safezone">
            {children}
          </PageAreaSafeZone>
        </PageAreaWithOverflow>
      </PaddedPage>
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
  isControlled: PropTypes.bool,
  hideScrollbars: PropTypes.bool,
  className: PropTypes.string,
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
