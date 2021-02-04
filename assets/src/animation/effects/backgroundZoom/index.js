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
import { BG_MIN_SCALE, BG_MAX_SCALE, SCALE_DIRECTION } from '../../constants';
import { AnimationZoom } from '../../parts/zoom';
import { lerp } from '../../utils';

export function EffectBackgroundZoom({
  element,
  zoomDirection = SCALE_DIRECTION.SCALE_OUT,
  duration = 1000,
  delay,
  easing,
}) {
  // Define the range based off the element scale
  // at element scale 400, the range should be [1/4, 1]
  // at element scale 100, the range should be [1, 4]
  const range = [BG_MIN_SCALE / element.scale, BG_MAX_SCALE / element.scale];

  return AnimationZoom({
    zoomFrom: lerp(zoomDirection === SCALE_DIRECTION.SCALE_OUT ? 1 : 0, range),
    zoomTo: 1,
    duration,
    delay,
    easing,
    targetLeafElement: true,
  });
}
