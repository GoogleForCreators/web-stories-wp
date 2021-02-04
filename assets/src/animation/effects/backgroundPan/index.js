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
import { BACKGROUND_ANIMATION_EFFECTS, DIRECTION } from '../../constants';
import SimpleAnimation from '../../parts/simpleAnimation';
import { getMediaBoundOffsets } from '../../utils';

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

  const translateToOriginX = 'translate3d(0%, 0, 0)';
  const translateToOriginY = 'translate3d(0, 0%, 0)';
  const offsets = element
    ? getMediaBoundOffsets({ element })
    : {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };
  const translate = {
    from: {
      [DIRECTION.RIGHT_TO_LEFT]: `translate3d(${offsets.left}%, 0, 0)`,
      [DIRECTION.LEFT_TO_RIGHT]: `translate3d(${offsets.right}%, 0, 0)`,
      [DIRECTION.BOTTOM_TO_TOP]: `translate3d(0, ${offsets.top}%, 0)`,
      [DIRECTION.TOP_TO_BOTTOM]: `translate3d(0, ${offsets.bottom}%, 0)`,
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
