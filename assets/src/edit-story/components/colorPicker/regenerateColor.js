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
import createSolid from '../../utils/createSolid';
import { TYPE_SOLID, TYPE_LINEAR, TYPE_RADIAL } from './constants';

function regenerateSolid({ currentColor: { r, g, b, a } }) {
  return createSolid(r, g, b, a);
}

function regenerateStops(stops) {
  return stops.map(({ color: { r, g, b, a }, position }) => ({
    color: createSolid(r, g, b, a).color,
    position,
  }));
}

function regenerateLinear({ stops, rotation, alpha }) {
  const minimal = {
    type: TYPE_LINEAR,
    stops: regenerateStops(stops),
  };
  if (rotation !== 0) {
    minimal.rotation = rotation;
  }
  if (alpha !== 1 && alpha !== undefined) {
    minimal.alpha = alpha;
  }
  return minimal;
}

function regenerateRadial({ stops, center, size, alpha }) {
  const minimal = {
    type: TYPE_RADIAL,
    stops: regenerateStops(stops),
  };
  if (center && (center.x !== 0.5 || center.y !== 0.5)) {
    minimal.center = center;
  }
  if (size && (size.w !== 1 || size.h !== 1)) {
    minimal.size = size;
  }
  if (alpha !== 1 && alpha !== undefined) {
    minimal.alpha = alpha;
  }
  return minimal;
}

function regenerateColor(pattern) {
  const { regenerate, type } = pattern;
  if (!regenerate) {
    return null;
  }

  switch (type) {
    case TYPE_SOLID:
      return regenerateSolid(pattern);
    case TYPE_LINEAR:
      return regenerateLinear(pattern);
    case TYPE_RADIAL:
      return regenerateRadial(pattern);

    // Ignore reason: only required for eslint, won't actually happen
    // istanbul ignore next
    default:
      return null;
  }
}

export default regenerateColor;
