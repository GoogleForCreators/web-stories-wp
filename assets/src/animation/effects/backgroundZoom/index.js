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

// @TODO hoist lerp from dashboard into here
const lerp = (range, progress) =>
  (1 - progress) * range[0] + progress * range[1];

export function EffectBackgroundZoom({
  element,
  normalizedScaleFrom = 0.75,
  duration = 1000,
  delay,
  easing,
}) {
  // console.log(element);
  const range = [1 / (element.scale / 100), 4 / (element.scale / 100)];
  return AnimationZoom({
    // @TODO we need to define the range based off the element scale
    // at element scale 400, the range should be [1/4, 1]
    // at element scale 100, the range should be [1, 4]
    zoomFrom: lerp(range, normalizedScaleFrom),
    zoomTo: 1,
    duration,
    delay,
    easing,
  });
}
