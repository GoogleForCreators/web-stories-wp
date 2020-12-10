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
  const { border, borderRadius } = element;
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
    borderRadius: borderRadius
      ? `${borderRadius.topLeft}px ${borderRadius.topRight}px ${borderRadius.bottomRight}px ${borderRadius.bottomLeft}px`
      : null,
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

export function getBorderRadius({ borderRadius }) {
  if (!borderRadius) {
    return {};
  }
  return {
    borderRadius: `${borderRadius.topLeft}px ${borderRadius.topRight}px ${borderRadius.bottomRight}px ${borderRadius.bottomLeft}px`,
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

/**
 * Returns border values based on if it's preview or not.
 *
 * @param {Object} borderRadius Original borderRadius.
 * @param {boolean} previewMode If it's preview mode.
 * @param {Function} converter Function to convert the values.
 * @return {Object} New border radius values.
 */
export function getResponsiveBorderRadius(
  borderRadius,
  previewMode,
  converter
) {
  if (!previewMode || !borderRadius) {
    return borderRadius;
  }
  const { topLeft, topRight, bottomLeft, bottomRight } = borderRadius;
  return {
    ...borderRadius,
    topLeft: converter(topLeft),
    topRight: converter(topRight),
    bottomLeft: converter(bottomLeft),
    bottomRight: converter(bottomRight),
  };
}
