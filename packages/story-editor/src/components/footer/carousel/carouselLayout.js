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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { CarouselScrollForward, CarouselScrollBack } from './carouselScroll';
import CarouselList from './carouselList';
import useCarousel from './useCarousel';
import { BUTTON_WIDTH, BUTTON_GAP } from './constants';

const Wrapper = styled.section`
  position: relative;
  display: grid;
  grid:
    /* Note the two empty 1fr areas on either side of the buttons - that's on purpose */
    '. prev-navigation . carousel . next-navigation .' auto /
    1fr
    ${BUTTON_WIDTH}px
    ${BUTTON_GAP}px
    auto
    ${BUTTON_GAP}px
    ${BUTTON_WIDTH}px
    1fr;
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

function CarouselLayout() {
  const { numPages } = useCarousel(({ state: { numPages } }) => ({ numPages }));

  if (numPages <= 0) {
    return null;
  }

  return (
    <Wrapper aria-label={__('Page Carousel', 'web-stories')}>
      <Area area="prev-navigation">
        <CarouselScrollBack />
      </Area>
      <Area area="carousel">
        <CarouselList />
      </Area>
      <Area area="next-navigation">
        <CarouselScrollForward />
      </Area>
    </Wrapper>
  );
}

export default CarouselLayout;
