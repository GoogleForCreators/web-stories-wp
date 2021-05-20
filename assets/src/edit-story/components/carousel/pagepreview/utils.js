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
  PAGE_WIDTH,
  FULLBLEED_HEIGHT,
  DANGER_ZONE_HEIGHT,
} from '../../../constants';

export function getBox({
  x,
  y,
  width,
  height,
  rotationAngle,
  isBackground,
  border: { left = 0, right = 0, top = 0, bottom = 0 } = {},
}) {
  return {
    x: isBackground ? 0 : x,
    y: isBackground ? -DANGER_ZONE_HEIGHT : y,
    width: isBackground ? PAGE_WIDTH : width + left + right,
    height: isBackground ? FULLBLEED_HEIGHT : height + top + bottom,
    rotationAngle: isBackground ? 0 : rotationAngle,
  };
}
