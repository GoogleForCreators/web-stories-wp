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
import { useEffect, useReduction } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { CAROUSEL_TRANSITION_DURATION, CarouselState } from '../../constants';

const TRANSITION_STATES = [CarouselState.Opening, CarouselState.Closing];

const carouselStateReducer = {
  // Only open if currently closed (and mark as OPENING, not actually open yet)
  // If in any other state, do nothing.
  openCarousel: (state: CarouselState) =>
    state === CarouselState.Closed ? CarouselState.Opening : state,

  // Only closed if currently open (and mark as CLOSING, not actually closed yet)
  // If in any other state, do nothing.
  closeCarousel: (state: CarouselState) =>
    state === CarouselState.Open ? CarouselState.Closing : state,

  // Mark transition to new state as completed - must be in a transition state.
  // If in any other state, do nothing.
  completeTransition: (state: CarouselState) => {
    switch (state) {
      case CarouselState.Opening:
        return CarouselState.Open;
      case CarouselState.Closing:
        return CarouselState.Closed;
      default:
        return state;
    }
  },
};

function useCarouselDrawer() {
  const [carouselState, actions] = useReduction(
    CarouselState.Open,
    carouselStateReducer
  );
  const isCarouselInTransition = TRANSITION_STATES.includes(carouselState);

  const { openCarousel, closeCarousel, completeTransition } = actions;

  useEffect(() => {
    if (!isCarouselInTransition) {
      return undefined;
    }
    const timeout = setTimeout(
      completeTransition,
      CAROUSEL_TRANSITION_DURATION
    );
    return () => clearTimeout(timeout);
  }, [isCarouselInTransition, completeTransition]);

  return {
    state: {
      carouselState,
      isCarouselInTransition,
    },
    actions: {
      // Only these two methods are exposed as public API
      openCarousel,
      closeCarousel,
    },
  };
}

export default useCarouselDrawer;
