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
import PropTypes from 'prop-types';

import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useConfig } from '../../app';
import { LeftArrow, RightArrow } from '../button';
import useCarousel from './useCarousel';

function CarouselScrollButton({ isForward = false }) {
  const {
    hasOverflow,
    canScrollBack,
    canScrollForward,
    scrollBack,
    scrollForward,
  } = useCarousel(
    ({
      state: { hasOverflow, canScrollBack, canScrollForward },
      actions: { scrollBack, scrollForward },
    }) => ({
      hasOverflow,
      canScrollBack,
      canScrollForward,
      scrollBack,
      scrollForward,
    })
  );
  const { isRTL } = useConfig();

  if (!hasOverflow) {
    // If no overflow, just abort quickly
    return null;
  }

  const canScroll = isForward ? canScrollForward : canScrollBack;
  const onClick = isForward ? scrollForward : scrollBack;
  const label = isForward
    ? __('Scroll Forward', 'web-stories')
    : __('Scroll Back', 'web-stories');

  // Show a right arrow if scrolling forward in LTR or not scrolling forward in RTL
  const Button =
    (!isRTL && isForward) || (isRTL && !isForward) ? RightArrow : LeftArrow;

  return (
    <Button
      isDisabled={!canScroll}
      onClick={onClick}
      width="24"
      height="24"
      aria-label={label}
    />
  );
}

CarouselScrollButton.propTypes = {
  isForward: PropTypes.bool,
};

function CarouselScrollForward() {
  return <CarouselScrollButton isForward />;
}

function CarouselScrollBack() {
  return <CarouselScrollButton />;
}

export { CarouselScrollForward, CarouselScrollBack };
