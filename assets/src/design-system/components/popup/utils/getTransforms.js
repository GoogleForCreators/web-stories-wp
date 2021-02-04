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
import { PLACEMENT } from '../constants';

export function getXTransforms(placement) {
  // left & right
  if (placement.startsWith('left')) {
    return -1;
  } else if (placement.startsWith('right')) {
    return null;
  }
  // top & bottom
  if (placement.endsWith('-start')) {
    return null;
  } else if (placement.endsWith('-end')) {
    return -1;
  }
  return -0.5;
}

export function getYTransforms(placement) {
  if (
    placement.startsWith('top') ||
    placement === PLACEMENT.RIGHT_END ||
    placement === PLACEMENT.LEFT_END
  ) {
    return -1;
  }
  if (placement === PLACEMENT.RIGHT || placement === PLACEMENT.LEFT) {
    return -0.5;
  }
  return null;
}

// note that we cannot use percentage values for transforms, which
// do not work correctly for rotated elements
export function getTransforms(placement) {
  const xTransforms = getXTransforms(placement);
  const yTransforms = getYTransforms(placement);
  if (!xTransforms && !yTransforms) {
    return '';
  }
  return `translate(${(xTransforms || 0) * 100}%, ${
    (yTransforms || 0) * 100
  }%)`;
}
