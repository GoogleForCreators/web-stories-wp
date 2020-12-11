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
import { canMaskHaveBorder } from '../masks';

function hasBorder({ border }) {
  if (!border) {
    return false;
  }
  const { left, top, right, bottom, color } = border;
  // If we have no color, let's short-circuit.
  if (!color) {
    return false;
  }
  // If we have no border set either, let's short-circuit.
  if (!left && !top && !right && !bottom) {
    return false;
  }
  return true;
}

/**
 * Check if border should be displayed for an element.
 *
 * @param {Object} element Element object.
 * @return {boolean} If should be displayed.
 */
export function shouldDisplayBorder(element) {
  return hasBorder(element) && canMaskHaveBorder(element);
}

/**
 * Gets the CSS values for an element with border.
 *
 * @param {Object} obj An object with params relevant to border.
 * @param {number} obj.left Left border width.
 * @param {number} obj.top Top border width.
 * @param {number} obj.right Right border width.
 * @param {number} obj.bottom Bottom border width.
 * @param {string} obj.width Original element width.
 * @param {string} obj.height Original element height.
 * @param {string} obj.posTop Element top position, needed for output mainly.
 * @param {string} obj.posLeft Element left position, needed for output mainly.
 * @return {Object} Positioning CSS.
 */
export function getBorderPositionCSS({
  left,
  top,
  right,
  bottom,
  width = '100%',
  height = '100%',
  posTop = '0px',
  posLeft = '0px',
}) {
  return {
    left: `calc(${posLeft} - ${left}px)`,
    top: `calc(${posTop} - ${top}px)`,
    width: `calc(${width} + ${left + right}px)`,
    height: `calc(${height} + ${top + bottom}px)`,
  };
}

/**
 * Gets style for the element with border.
 *
 * @param {Object} element Element.
 * @return {Object} Border style.
 */
export function getBorderStyle(element) {
  // If there's no border, return the radius only.
  if (!hasBorder(element)) {
    return getBorderRadius(element);
  }
  const { border } = element;
  const { color: rawColor, left, top, right, bottom } = border;
  const color = getBorderColor({ color: rawColor });

  // We're making the border-width responsive just for the preview,
  // since the calculation is not 100% precise here, we're opting to the safe side by rounding the widths up
  // as opposed to having potential margin between the border and the element.
  // When not in preview, the rounding doesn't have any effect.
  const borderWidth = `${Math.ceil(top)}px ${Math.ceil(right)}px ${Math.ceil(
    bottom
  )}px ${Math.ceil(left)}px`;
  const borderStyle = {
    borderWidth,
    borderColor: color,
    borderStyle: 'solid',
    ...getBorderRadius(element),
  };
  return {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    ...borderStyle,
  };
}

function getPercentage(value, fullValue) {
  if (!value || !fullValue) {
    return 0;
  }
  return (value / fullValue) * 100;
}

function getCornerPercentages(borderRadius, measure) {
  if (!borderRadius) {
    return '0%';
  }
  const { topLeft, topRight, bottomRight, bottomLeft } = borderRadius;
  return {
    topLeft: getPercentage(topLeft, measure),
    topRight: getPercentage(topRight, measure),
    bottomRight: getPercentage(bottomRight, measure),
    bottomLeft: getPercentage(bottomLeft, measure),
  };
}

/**
 * Gets border radius from pixel units.
 *
 * @param {Object} element Element.
 * @return {{}|{borderRadius: string}} Border radius value for CSS.
 */
export function getBorderRadius(element) {
  const { borderRadius, width, height } = element;
  if (!borderRadius || !canMaskHaveBorder(element)) {
    return {};
  }
  /* We're using the format
    `border-radius: topLeft topRight bottomRight bottomLeft / topLeft topRight bottomRight bottomLeft`
    here so that we could convert one px value for border into % value which requires two values per each corner. */
  const wValues = getCornerPercentages(borderRadius, width);
  const hValues = getCornerPercentages(borderRadius, height);
  return {
    borderRadius: `${wValues.topLeft}% ${wValues.topRight}% ${wValues.bottomRight}% ${wValues.bottomLeft}% / ${hValues.topLeft}% ${hValues.topRight}% ${hValues.bottomRight}% ${hValues.bottomLeft}%`,
  };
}

/**
 * Gets the border color from rgba object.
 *
 * @param {Object} color Solid color object.
 * @param {Object} color.color Color object consisting rgba values.
 * @return {string} rgba value for CSS.
 */
export function getBorderColor({ color }) {
  // Border color can be only solid.
  const {
    color: { r, g, b, a },
  } = color;
  return `rgba(${r},${g},${b},${a === undefined ? 1 : a})`;
}

/**
 * Returns border values based on if it's preview or not.
 *
 * @param {Object} border Original border.
 * @param {boolean} previewMode If it's preview mode.
 * @param {Function} converter Function to convert the border values.
 * @return {Object} New border values.
 */
export function getResponsiveBorder(border, previewMode, converter) {
  if (!previewMode || !border) {
    return border;
  }
  const { left, top, right, bottom } = border;
  return {
    ...border,
    left: converter(left),
    top: converter(top),
    right: converter(right),
    bottom: converter(bottom),
  };
}
