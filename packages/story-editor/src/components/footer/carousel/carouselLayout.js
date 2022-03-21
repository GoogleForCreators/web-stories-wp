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
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import { useRef } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useLayout } from '../../../app';
import {
  CAROUSEL_STATE,
  CAROUSEL_TRANSITION_DURATION,
} from '../../../constants';
import { Z_INDEX_FOOTER } from '../../../constants/zIndex';
import { CarouselScrollForward, CarouselScrollBack } from './carouselScroll';
import CarouselList from './carouselList';
import CarouselDrawer from './carouselDrawer';
import useCarousel from './useCarousel';
import {
  NAVIGATION_BUTTON_WIDTH,
  NAVIGATION_BUTTON_GAP,
  DRAWER_BUTTON_GAP_EXPANDED,
  DRAWER_BUTTON_GAP_COLLAPSED,
} from './constants';

const DRAWER_BUTTON_GAP_DIFF =
  DRAWER_BUTTON_GAP_EXPANDED - DRAWER_BUTTON_GAP_COLLAPSED;

const Wrapper = styled.section`
  position: relative;
  display: grid;
  grid:
    /* Note the two empty 1fr areas on either side of the buttons - that's on purpose
     *
     * d = drawer button
     * p = previous arrow
     * c = carousel page list
     * n = next arrow
     */
    '. d d d d d .' 32px
    '. . . . . . .' ${({ isCollapsed }) =>
      isCollapsed ? DRAWER_BUTTON_GAP_COLLAPSED : DRAWER_BUTTON_GAP_EXPANDED}px
    '. p . c . n .' auto /
    1fr
    ${NAVIGATION_BUTTON_WIDTH}px
    ${NAVIGATION_BUTTON_GAP}px
    auto
    ${NAVIGATION_BUTTON_GAP}px
    ${NAVIGATION_BUTTON_WIDTH}px
    1fr;
  width: 100%;
  height: auto;
  z-index: ${Z_INDEX_FOOTER};

  &.carousel-enter {
    top: ${({ thumbHeight }) => thumbHeight + DRAWER_BUTTON_GAP_DIFF}px;

    &.carousel-enter-active {
      top: 0;
      transition: ${CAROUSEL_TRANSITION_DURATION}ms ease-out;
      transition-property: top;
    }
  }

  &.carousel-exit {
    top: 0;

    &.carousel-exit-active {
      top: ${({ thumbHeight }) => thumbHeight + DRAWER_BUTTON_GAP_DIFF}px;
      transition: ${CAROUSEL_TRANSITION_DURATION}ms ease-out;
      transition-property: top;
    }
  }
`;

const Area = styled.div`
  grid-area: ${({ area }) => area};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

function CarouselLayout() {
  const { carouselState } = useLayout(({ state: { carouselState } }) => ({
    carouselState,
  }));

  const { numPages, pageThumbHeight } = useCarousel(
    ({ state: { numPages, pageThumbHeight } }) => ({
      numPages,
      pageThumbHeight,
    })
  );
  const nodeRef = useRef();
  if (numPages <= 0) {
    return null;
  }

  const isCollapsed = carouselState === CAROUSEL_STATE.CLOSED;

  const isOpenOrOpening = [
    CAROUSEL_STATE.OPEN,
    CAROUSEL_STATE.OPENING,
  ].includes(carouselState);

  return (
    <CSSTransition
      in={isOpenOrOpening}
      classNames="carousel"
      containerRef
      nodeRef={nodeRef}
      timeout={CAROUSEL_TRANSITION_DURATION}
    >
      <Wrapper
        ref={nodeRef}
        aria-label={__('Page Carousel', 'web-stories')}
        isCollapsed={isCollapsed}
        thumbHeight={pageThumbHeight}
      >
        <Area area="d">
          <CarouselDrawer />
        </Area>
        {!isCollapsed && (
          <>
            <Area area="p">
              <CarouselScrollBack />
            </Area>
            <Area area="c">
              <CarouselList />
            </Area>
            <Area area="n">
              <CarouselScrollForward />
            </Area>
          </>
        )}
      </Wrapper>
    </CSSTransition>
  );
}

export default CarouselLayout;
