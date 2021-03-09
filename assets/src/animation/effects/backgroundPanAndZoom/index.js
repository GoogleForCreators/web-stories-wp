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
  SCALE_DIRECTION,
  DIRECTION,
  BACKGROUND_ANIMATION_EFFECTS,
} from '../../constants';
import SimpleAnimation from '../../parts/simpleAnimation';
import { EffectBackgroundPan } from '../backgroundPan';
import { EffectBackgroundZoom } from '../backgroundZoom';
import { getMediaOrigin, getMediaBoundOffsets } from '../../utils';

const defaults = {
  fill: 'forwards',
  duration: 1000,
};

export function EffectBackgroundPanAndZoom({
  element,
  zoomDirection = SCALE_DIRECTION.SCALE_OUT,
  panDir = DIRECTION.RIGHT_TO_LEFT,
  duration = 1000,
  delay,
  easing,
}) {
  const timings = {
    ...defaults,
    duration,
    delay,
    easing,
  };

  const animationName = `direction-${panDir}-${zoomDirection}-${BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value}`;

  // Background animations aren't really composable through element nesting
  // because they all target the same dom node. To accomomdate for this we
  // manually compose the keyframes and use those to generate a new animation.
  const { generatedKeyframes: zoomGeneratedKeyframes } = EffectBackgroundZoom({
    element,
    zoomDirection,
  });
  const { generatedKeyframes: panGeneratedKeyframes } = EffectBackgroundPan({
    element,
    panDir,
  });

  // The key to access the keyframes in the generated keyframes object returned
  // is internal to the effect. Both BgPan & BgZoom only generate one set of
  // keyframes tho, so although this feels gross, it's fine for now to avoid
  // an alteration to the exisitng structure.
  const zoomKeyframes = Object.values(zoomGeneratedKeyframes)?.[0] || [];
  const panKeyframes = Object.values(panGeneratedKeyframes)?.[0] || [];

  const startTransform = `${panKeyframes?.transform[0]} ${zoomKeyframes?.transform[0]}`;
  const zoomLastTransformIndex = (zoomKeyframes?.transform?.length || 1) - 1;
  const panLastTransformIndex = (panKeyframes?.transform?.length || 1) - 1;
  const endTransform = `${panKeyframes?.transform[zoomLastTransformIndex]} ${zoomKeyframes?.transform[panLastTransformIndex]}`;

  // We have to move the origin with respect to the pan
  // direction and the current media position relative to
  // the frame. This prevents area from ever being shown
  // where the media does't fill the frame during scaling
  const origin = getMediaOrigin(getMediaBoundOffsets(element));
  const transformOrigin =
    {
      [DIRECTION.RIGHT_TO_LEFT]: [
        `0% ${origin.vertical}%`,
        `0% ${origin.vertical}%`,
      ],
      [DIRECTION.LEFT_TO_RIGHT]: [
        `100% ${origin.vertical}%`,
        `100% ${origin.vertical}%`,
      ],
      [DIRECTION.BOTTOM_TO_TOP]: [
        `${origin.horizontal}% 0%`,
        `${origin.horizontal}% 0%`,
      ],
      [DIRECTION.TOP_TO_BOTTOM]: [
        `${origin.horizontal}% 100%`,
        `${origin.horizontal}% 100%`,
      ],
    }[panDir] || [];

  const keyframes = {
    transform: [startTransform, endTransform],
    transformOrigin,
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
