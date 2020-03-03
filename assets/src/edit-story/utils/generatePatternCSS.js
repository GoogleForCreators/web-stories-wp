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

function round(val, pos) {
  return Number(val.toFixed(pos));
}

function getGradientDescription({ type, rotation, center, size }) {
  const sizeString = size
    ? `ellipse ${round(100 * size.w, 2)}% ${round(100 * size.h, 2)}%`
    : '';
  const centerString = center
    ? ` at ${round(100 * center.x, 2)}% ${round(100 * center.y, 2)}%`
    : '';
  const rotationString = rotation ? `${rotation}turn` : '';
  switch (type) {
    case 'radial':
      if (!centerString && !sizeString) {
        return null;
      }
      return `${sizeString}${centerString}`.trim();

    case 'conic':
      if (!rotationString && !centerString) {
        return null;
      }
      const fromRotationString = rotationString ? `from ${rotationString}` : '';
      return `${fromRotationString}${centerString}`.trim();

    case 'linear':
      return rotationString;

    default:
      return null;
  }
}

function getStopList(stops, isAngular = false) {
  const getPosition = (val) =>
    isAngular ? `${round(val, 4)}turn` : `${round(val * 100, 2)}%`;
  const getColor = ({ r, g, b, a = 1 }) => rgba(r, g, b, a);
  return stops.map(
    ({ color, position }) => `${getColor(color)} ${getPosition(position)}`
  );
}

/**
 * Generate CSS from a Pattern.
 *
 * @param {Object} pattern Patterns as describe by the Pattern type
 * @param {string} property Type of CSS to generate. Defaults to 'background',
 * but can also be 'color', 'fill' or 'stroke'.
 *
 * @return {string} CSS declaration, e.g. 'fill: transparent' or
 * 'background-image: radial-gradient(red, blue)'.
 */
function generatePatternCSS(pattern, property = 'background') {
  const isBackground = property === 'background';
  if (pattern === null) {
    return `${property}: transparent`;
  }

  const { type = 'solid' } = pattern;
  if (!['solid', 'radial', 'linear', 'conic'].includes(type)) {
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
    const propertyPostfix = isBackground ? '-color' : '';
    return `${property}${propertyPostfix}: ${rgba(r, g, b, a)}`;
  }

  const { stops } = pattern;
  const func = `${type}-gradient`;
  const description = getGradientDescription(pattern);
  const stopList = getStopList(stops, type === 'conic');
  const parms = description ? [description, ...stopList] : stopList;

  return `background-image: ${func}(${parms.join(', ')})`;
}

export default generatePatternCSS;
