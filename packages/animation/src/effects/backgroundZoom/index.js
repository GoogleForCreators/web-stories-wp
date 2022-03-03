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
import { clamp, progress, lerp } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { BG_MIN_SCALE, BG_MAX_SCALE, SCALE_DIRECTION } from '../../constants';
import { AnimationZoom } from '../../parts/zoom';
import { getMediaOrigin, getMediaBoundOffsets } from '../../utils';

export function EffectBackgroundZoom({
  element,
  zoomDirection = SCALE_DIRECTION.SCALE_OUT,
  duration = 2000,
  delay,
  easing = 'cubic-bezier(.3,0,.55,1)',
  transformOrigin,
}) {
  // Define the min/max range based off the element scale
  // at element scale 400, the range should be [1/4, 1]
  // at element scale 100, the range should be [1, 4]
  const range = {
    MIN: BG_MIN_SCALE / element.scale,
    MAX: BG_MAX_SCALE / element.scale,
  };

  // Compute what a 50% difference is relative to [0%, 400%]
  const normalizedDelta = progress(50, { MIN: 0, MAX: BG_MAX_SCALE });
  // Interpret the normalized delta into the compounded scale coordinate space.
  const delta = lerp(normalizedDelta, { MIN: 0, MAX: range.MAX });
  // Apply the interpretted fixed delta to the elements scale
  const zoomFrom =
    1 + (zoomDirection === SCALE_DIRECTION.SCALE_OUT ? 1 : -1) * delta;

  return AnimationZoom({
    // make sure we stay within min/max range so image always fills canvas
    zoomFrom: clamp(zoomFrom, range),
    zoomTo: 1,
    duration,
    delay,
    easing,
    targetLeafElement: true,
    // Account for moving bg media relative to frame
    transformOrigin:
      transformOrigin ||
      getMediaOrigin(element && getMediaBoundOffsets({ element })),
  });
}
