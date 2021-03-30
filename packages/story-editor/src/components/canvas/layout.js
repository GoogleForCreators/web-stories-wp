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
import { __ } from '@web-stories-wp/i18n';
import { generatePatternStyles } from '@web-stories-wp/patterns';
import {
  FULLBLEED_RATIO,
  PAGE_RATIO,
  ALLOWED_EDITOR_PAGE_WIDTHS,
} from '@web-stories-wp/units';

/**
 * Internal dependencies
 */
import {
  useResizeEffect,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
import { HEADER_HEIGHT } from '../../constants';
import pointerEventsCss from '../../utils/pointerEventsCss';
import { useCanvas } from '../../app/canvas';

/**
 * @file See https://user-images.githubusercontent.com/726049/72654503-bfffe780-3944-11ea-912c-fc54d68b6100.png
 * for the layering details.
 */

export const Z_INDEX = {
  NAV: 2,
  EDIT: 3,
};

const MENU_HEIGHT = THEME_CONSTANTS.ICON_SIZE;
const MENU_GAP = 16;
const CAROUSEL_HEIGHT = 104;
const PAGE_NAV_WIDTH = THEME_CONSTANTS.LARGE_BUTTON_SIZE;
const PAGE_NAV_GAP = 24;

const Layer = styled.section`
  ${pointerEventsCss}

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  ${({ zIndex }) => (typeof zIndex === 'number' ? `z-index: ${zIndex};` : '')}

  display: grid;
  /*
    . = empty space
    h = header
    b = back navigation
    f = forward navigation
    p = canvas page
    m = page action menu
    c = thumbnail carousel

    Also note that we need to specify all the widths and heights
    even though some of the elements could just use the size that
    the element takes up. This is because we reuse this grid in 3
    different layers on top of each other and some elements are
    missing in some layers, but we still need them to align perfectly.
  */
  grid:
    'h h h h h h h' ${HEADER_HEIGHT}px
    '. . . . . . .' minmax(16px, 1fr)
    '. b . p . f .' var(--fullbleed-height-px)
    '. . . . . . .' ${MENU_GAP}px
    'm m m m m m m' ${MENU_HEIGHT}px
    '. . . . . . .' 1fr
    'c c c c c c c' ${CAROUSEL_HEIGHT}px
    /
    1fr
    ${PAGE_NAV_WIDTH}px
    ${PAGE_NAV_GAP}px
    var(--fullbleed-width-px)
    ${PAGE_NAV_GAP}px
    ${PAGE_NAV_WIDTH}px
    1fr;
  height: 100%;
`;

const Area = styled.div`
  ${pointerEventsCss}

  grid-area: ${({ area }) => area};
  overflow: ${({ canOverflow }) => (canOverflow ? 'visible' : 'hidden')};
  position: relative;
  width: 100%;
  height: 100%;
  ${({ zIndex }) => (zIndex !== undefined ? `z-index: ${zIndex}` : null)};
`;

// Page area is not `overflow:hidden` by default to allow different clipping
// mechanisms.
const PageAreaFullbleedContainer = styled(Area).attrs({
  area: 'p',
  canOverflow: true,
})`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ isBackgroundSelected, theme }) =>
    isBackgroundSelected &&
    `
    &:before {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: ${theme.colors.border.selection} 1px solid;
      border-radius: 10px;
    }
  `}
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
  border-radius: 5px;
`;

const PageAreaSafeZone = styled.div`
  width: 100%;
  height: var(--page-height-px);
  overflow: visible;
  position: relative;
  margin: auto 0;
`;

const HeadArea = styled(Area).attrs({ area: 'h' })``;

const MenuArea = styled(Area).attrs({ area: 'm', canOverflow: true })``;

const NavArea = styled(Area)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavPrevArea = styled(NavArea).attrs({
  area: 'b',
  canOverflow: true,
})``;

const NavNextArea = styled(NavArea).attrs({
  area: 'f',
  canOverflow: true,
})``;

const CarouselArea = styled(Area).attrs({
  area: 'c',
  canOverflow: true,
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
    const maxHeight = height - HEADER_HEIGHT - MENU_HEIGHT - CAROUSEL_HEIGHT;

    const bestSize =
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
    isBackgroundSelected = false,
  },
  ref
) {
  return (
    <PageAreaFullbleedContainer
      ref={fullbleedRef}
      data-testid="fullbleed"
      aria-label={__('Fullbleed area', 'web-stories')}
      isBackgroundSelected={isBackgroundSelected}
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
  isBackgroundSelected: PropTypes.bool,
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
