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
import { useCallback } from '@googleforcreators/react';
import { __, _n, sprintf } from '@googleforcreators/i18n';
import styled from 'styled-components';
import {
  Button,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
  BUTTON_SIZES,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory, useLayout } from '../../../app';
import { CAROUSEL_STATE } from '../../../constants';
import CarouselDrawerIcon from './carouselDrawerIcon';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  white-space: nowrap;
  gap: 8px;
`;

function CarouselDrawer() {
  const { carouselState, openCarousel, closeCarousel } = useLayout(
    ({
      state: { carouselState },
      actions: { openCarousel, closeCarousel },
    }) => ({ carouselState, openCarousel, closeCarousel })
  );

  const { currentPageNumber, pageCount } = useStory(
    ({ state: { currentPageNumber, pages } }) => ({
      currentPageNumber,
      pageCount: pages.length,
    })
  );

  const onClick = useCallback(() => {
    // Note that we only trigger a change of state if the carousel is in one of these
    // stable states, and not if it's in any of the transitioning states.
    if (carouselState === CAROUSEL_STATE.OPEN) {
      closeCarousel();
    } else if (carouselState === CAROUSEL_STATE.CLOSED) {
      openCarousel();
    }
  }, [carouselState, openCarousel, closeCarousel]);

  return (
    <Wrapper>
      <StyledButton
        aria-label={__('Toggle page carousel', 'web-stories')}
        onClick={onClick}
        variant={BUTTON_VARIANTS.RECTANGLE}
        size={BUTTON_SIZES.SMALL}
        type={BUTTON_TYPES.TERTIARY}
      >
        {sprintf(
          /* translators: 1: current page number. 2: total page count. */
          _n(
            '%1$d of %2$d page',
            '%1$d of %2$d pages',
            pageCount,
            'web-stories'
          ),
          currentPageNumber,
          pageCount
        )}
        <CarouselDrawerIcon state={carouselState} />
      </StyledButton>
    </Wrapper>
  );
}

export default CarouselDrawer;
