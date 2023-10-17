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
 * Internal dependencies
 */
import { useLayout } from '../../app';
import { CarouselState } from '../../constants';
import {
  DRAWER_BUTTON_HEIGHT,
  DRAWER_BUTTON_GAP_EXPANDED,
  DRAWER_BUTTON_GAP_COLLAPSED,
  WIDE_THUMBNAIL_HEIGHT,
} from './carousel/constants';
import { FOOTER_TOP_MARGIN } from './constants';

function useFooterHeight() {
  // Footer height is exclusively determined by the carousel height + some fixed top margin
  const { carouselState } = useLayout(({ state: { carouselState } }) => ({
    carouselState,
  }));

  if (carouselState === CarouselState.Closed) {
    // Collapsed - height is only carousel button height + collapsed gap both top and bottom
    return (
      FOOTER_TOP_MARGIN + DRAWER_BUTTON_HEIGHT + DRAWER_BUTTON_GAP_COLLAPSED * 2
    );
  }
  // Expanded or collapsed/expanding - height is button + wide gap + max thumbnail height
  return (
    FOOTER_TOP_MARGIN +
    DRAWER_BUTTON_HEIGHT +
    DRAWER_BUTTON_GAP_EXPANDED +
    WIDE_THUMBNAIL_HEIGHT
  );
}

export default useFooterHeight;
