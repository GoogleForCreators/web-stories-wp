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

export function shouldDisplayBorder(element) {
  return hasBorder(element) && canMaskHaveBorder(element);
}

export function getBorderPositionCSS({
  left,
  top,
  right,
  bottom,
  width = '100%',
  height = '100%',
  posTop = '0px',
  posLeft = '0px',
  skipPositioning = true,
}) {
  if (!skipPositioning) {
    return {
      left: `calc(${posLeft} - ${left}px)`,
      top: `calc(${posTop} - ${top}px)`,
      width: `calc(${width} + ${left + right}px)`,
      height: `calc(${height} + ${top + bottom}px)`,
    };
  }
  return '';
}

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
    ...getBorderPositionCSS({
      left,
      top,
      right,
      bottom,
    }),
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

export function getInnerRadius(outerRadius, oneSide, otherSide) {
  return outerRadius - Math.min(outerRadius, Math.max(oneSide, otherSide)) / 2;
}

function getPercentage(value, fullValue) {
  if (!value) {
    return 0;
  }
  return (value / fullValue) * 100;
}

function getCornerPercentages(borderRadius, measure) {
  if (!borderRadius) {
    return '0%';
  }
  const { topLeft, topRight, bottomRight, bottomLeft } = borderRadius;
  return `${getPercentage(topLeft, measure)}% ${getPercentage(
    topRight,
    measure
  )}% ${getPercentage(bottomRight, measure)}% ${getPercentage(
    bottomLeft,
    measure
  )}%`;
}

export function getBorderRadius({ borderRadius, width, height }) {
  if (!borderRadius) {
    return {};
  }
  return {
    borderRadius: `${getCornerPercentages(
      borderRadius,
      width
    )} / ${getCornerPercentages(borderRadius, height)}`,
  };
}

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
