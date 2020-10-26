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
import { canMaskHaveBorder } from '../../masks';
import { BORDER_POSITION } from '../../constants';

export function shouldDisplayBorder(element) {
  const { border } = element;
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

  return canMaskHaveBorder(element);
}

function getBorderPositionCSS({ left, top, right, bottom, position }) {
  if (BORDER_POSITION.OUTSIDE === position) {
    return {
      top: `${-top}px`,
      height: `calc(100% + ${top + bottom}px)`,
      left: `${-left}px`,
      width: `calc(100% + ${left + right}px)`,
    };
  }
  if (BORDER_POSITION.CENTER === position) {
    return {
      top: `${-top / 2}px`,
      height: `calc(100% + ${(top + bottom) / 2}px)`,
      left: `${-left / 2}px`,
      width: `calc(100% + ${(left + right) / 2}px)`,
    };
  }
  return '';
}

export function getBorderStyle({
  color: rawColor,
  left,
  top,
  right,
  bottom,
  position,
}) {
  const {
    color: { r, g, b, a },
  } = rawColor;
  const color = `rgba(${r},${g},${b},${a === undefined ? 1 : a})`;

  // We're making the border-width responsive just for the preview,
  // since the calculation is not 100% precise here, we're opting to the safe side by rounding the widths up
  // as opposed to having potential margin between the border and the element.
  // When not in preview, the rounding doesn't have any effect.
  const borderWidth = `${Math.ceil(top)}px ${Math.ceil(right)}px ${Math.ceil(
    bottom
  )}px ${Math.ceil(left)}px`;
  return {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    ...getBorderPositionCSS({ left, top, right, bottom, position }),
    borderWidth,
    borderColor: color,
    borderStyle: 'solid',
  };
}
