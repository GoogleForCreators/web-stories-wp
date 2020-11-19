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
import {
  FULLBLEED_RATIO,
  PAGE_HEIGHT,
  PAGE_WIDTH,
} from '../../../edit-story/constants';
import getMediaSizePositionProps from '../../../edit-story/elements/media/getMediaSizePositionProps';
import { getBox } from '../../../edit-story/units/dimensions';
import { BACKGROUND_ANIMATION_EFFECTS, DIRECTION } from '../../constants';
import SimpleAnimation from '../../parts/simpleAnimation';

const FULLBLEED_PAGE_HEIGHT = (1 / FULLBLEED_RATIO) * PAGE_WIDTH;

export function EffectBackgroundPan({
  panDir = DIRECTION.RIGHT_TO_LEFT,
  duration = 500,
  delay,
  easing,
  element,
}) {
  const timings = {
    fill: 'both',
    duration,
    delay,
    easing,
  };

  const animationName = `direction-${panDir}-${BACKGROUND_ANIMATION_EFFECTS.PAN.value}`;
  // Get elements box based on a given page size with proper ratio.
  const box = getBox(element, PAGE_WIDTH, PAGE_HEIGHT);
  // Calculate image offsets based off given box, focal point
  const media = getMediaSizePositionProps(
    element.resource,
    box.width,
    box.height,
    element.scale,
    element.focalX,
    element.focalY
  );

  // Since we don't know the page size at the time this animation will be called,
  // we want to divide out the page size and make these bounds relative to the element size.
  const translateToLeftBound = `translate3d(${
    (media.offsetX / media.width) * 100
  }%, 0, 0)`;
  const translateToRightBound = `translate3d(-${
    ((media.width - (media.offsetX + PAGE_WIDTH)) / media.width) * 100
  }%, 0, 0)`;
  const translateToTopBound = `translate3d(0, ${
    (media.offsetY / media.height) * 100
  }%, 0)`;
  const translateToBottomBound = `translate3d(0, -${
    ((media.height - (media.offsetY + FULLBLEED_PAGE_HEIGHT)) / media.height) *
    100
  }%, 0)`;
  const translateToOriginX = 'translate3d(0%, 0, 0)';
  const translateToOriginY = 'translate3d(0, 0%, 0)';

  const translate = {
    from: {
      [DIRECTION.RIGHT_TO_LEFT]: translateToRightBound,
      [DIRECTION.LEFT_TO_RIGHT]: translateToLeftBound,
      [DIRECTION.BOTTOM_TO_TOP]: translateToBottomBound,
      [DIRECTION.TOP_TO_BOTTOM]: translateToTopBound,
    },
    to: {
      [DIRECTION.RIGHT_TO_LEFT]: translateToOriginX,
      [DIRECTION.LEFT_TO_RIGHT]: translateToOriginX,
      [DIRECTION.BOTTOM_TO_TOP]: translateToOriginY,
      [DIRECTION.TOP_TO_BOTTOM]: translateToOriginY,
    },
  };

  const keyframes = {
    transform: [translate.from[panDir], translate.to[panDir]],
  };

  const { id, WAAPIAnimation, AMPTarget, AMPAnimation } = SimpleAnimation(
    animationName,
    keyframes,
    timings,
    false,
    true
  );

  return {
    id,
    WAAPIAnimation,
    AMPTarget,
    AMPAnimation,
    generatedKeyframes: {
      [animationName]: keyframes,
    },
  };
}
