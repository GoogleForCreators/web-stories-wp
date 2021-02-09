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
import { AnimationZoom } from '../../parts/zoom';
import { SCALE_DIRECTION } from '../../constants';

export function EffectZoom({
  scaleDirection = SCALE_DIRECTION.SCALE_IN,
  duration = 1000,
  delay,
  easing,
}) {
  return AnimationZoom({
    zoomFrom: scaleDirection === SCALE_DIRECTION.SCALE_OUT ? 1 / 3 : 3,
    zoomTo: 1,
    duration,
    delay,
    easing,
  });
}
