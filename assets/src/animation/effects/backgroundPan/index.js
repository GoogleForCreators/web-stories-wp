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
import { getBox } from '../../../edit-story/units/dimensions';
import getMediaSizePositionProps from '../../../edit-story/elements/media/getMediaSizePositionProps';
import { BACKGROUND_ANIMATION_EFFECTS, DIRECTION } from '../../constants';
import SimpleAnimation from '../../parts/simpleAnimation';

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
  const box = getBox(element, 66.67, 100);
  const mediaPosition = getMediaSizePositionProps(
    element.resource,
    box.width,
    box.height,
    element.scale,
    element.focalX,
    element.focalY
  );
  const keyframes = {
    transform: [
      `translateX(${(mediaPosition.offsetX / mediaPosition.width) * 100}%)`,
      `translateX(0%)`,
    ],
  };

  // console.log('PAN %X: ', mediaPosition.offsetX / mediaPosition.width);

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
