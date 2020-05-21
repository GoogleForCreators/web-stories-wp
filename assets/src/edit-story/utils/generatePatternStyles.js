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
import { rgba } from 'polished';

/**
 * Truncate a number to a given number of decimals.
 *
 * @param {number} val Number to truncate
 * @param {number} pos Maximum number of allowed decimals
 *
 * @return {number} Number in given precision
 */
function truncate(val, pos) {
  return Number(val.toFixed(pos));
}

/**
 * Get a description for a gradient - that is the first parameter to the
 * gradient function. It might be null (but never for linears).
 *
 * For a linear gradient, always return the rotation as description.
 *
 * For a radial gradient, return either center, size, both or none
 * depending on whether the values are set.
 *
 * @param {Object} pattern Gradient pattern description
 * @param {string} pattern.type Gradient type as a string
 * @param {number} pattern.rotation Gradient rotation between 0 and 1
 * @param {Object} pattern.center Gradient center if not 50/50
 * @param {Object} pattern.size Gradient size if not full size
 *
 * @return {string} Minimal description for gradient.
 */
function getGradientDescription({ type, rotation, center, size }) {
  const sizeString = size
    ? `ellipse ${truncate(100 * size.w, 2)}% ${truncate(100 * size.h, 2)}%`
    : '';
  const centerString = center
    ? ` at ${truncate(100 * center.x, 2)}% ${truncate(100 * center.y, 2)}%`
    : '';
  switch (type) {
    case 'radial':
      if (!centerString && !sizeString) {
        return null;
      }
      return `${sizeString}${centerString}`.trim();
    case 'linear':
      // Always include rotation and offset by .5turn, as default is .5turn(?)
      return `${((rotation || 0) + 0.5) % 1}turn`;

    // Ignore reason: only here because of eslint, will not happen
    // istanbul ignore next
    default:
      return null;
  }
}

/**
 * Convert a list of stops to serialized minimal versions. And use percent
 * or turn as unit depending on whether stops are angular or not.
 *
 * @param {Array} stops List of stops as an object with color and position
 * @param {number} alpha Alpha opacity to multiple to each stop
 *
 * @return {Array} List of serialized stops
 */
function getStopList(stops, alpha) {
  const getColor = ({ r, g, b, a = 1 }) => rgba(r, g, b, a * alpha);
  return stops.map(
    ({ color, position }) =>
      `${getColor(color)} ${truncate(position * 100, 2)}%`
  );
}

/**
 * Generate CSS object from a Pattern.
 *
 * @param {Object} pattern Patterns as describe by the Pattern type
 * @param {string} property Type of CSS to generate. Defaults to 'background',
 * but can also be 'color', 'fill' or 'stroke'.
 *
 * @return {Object} CSS declaration as object, e.g. {fill: 'transparent'} or
 * {backgroundImage: 'radial-gradient(red, blue)'}.
 */
function generatePatternStyles(pattern = null, property = 'background') {
  const isBackground = property === 'background';
  if (pattern === null) {
    return { [property]: 'transparent' };
  }

  const { type = 'solid' } = pattern;
  if (!['solid', 'radial', 'linear'].includes(type)) {
    throw new Error(`Unknown pattern type: '${type}'`);
  }

  // Gradients are only possible for backgrounds
  if (!isBackground && type !== 'solid') {
    throw new Error(
      `Can only generate solid colors for property '${property}'`
    );
  }

  if (type === 'solid') {
    const {
      color: { r, g, b, a = 1 },
    } = pattern;
    const objectPropertyPostfix = isBackground ? 'Color' : '';
    return { [`${property}${objectPropertyPostfix}`]: rgba(r, g, b, a) };
  }

  const { stops, alpha = 1 } = pattern;
  const func = `${type}-gradient`;
  const description = getGradientDescription(pattern);
  const stopList = getStopList(stops, alpha);
  const parms = description ? [description, ...stopList] : stopList;
  const value = `${func}(${parms.join(', ')})`;
  return { backgroundImage: value };
}

export default generatePatternStyles;
