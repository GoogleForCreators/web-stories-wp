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
import { getElementMask, MaskTypes } from '../../masks';
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

  // If the mask type is anything else than rectangle, let's short-circuit.
  const mask = getElementMask(element);
  return !(mask?.type && mask.type !== MaskTypes.RECTANGLE);
}

function getBorderPositionCSS(
  { left, top, right, bottom, position },
  unit = 'px'
) {
  if (BORDER_POSITION.OUTSIDE === position) {
    return {
      top: `${-top}${unit}`,
      height: `calc(100% + ${top + bottom}${unit})`,
      left: `${-left}${unit}`,
      width: `calc(100% + ${left + right}${unit})`,
    };
  }
  if (BORDER_POSITION.CENTER === position) {
    return {
      top: `${-top / 2}${unit}`,
      height: `calc(100% + ${(top + bottom) / 2}${unit})`,
      left: `${-left / 2}${unit}`,
      width: `calc(100% + ${(left + right) / 2}${unit})`,
    };
  }
  return '';
}

export function getBorderStyle(
  { dash, gap, color: rawColor, left, top, right, bottom, position },
  unit = 'px'
) {
  const {
    color: { r, g, b, a },
  } = rawColor;
  const color = `rgba(${r},${g},${b},${a === undefined ? 1 : a})`;

  const avoidCorners = gap && position === BORDER_POSITION.OUTSIDE;
  // When gap is assigned, we're adjusting background-size so that there wouldn't be "floating" border in the corners.
  // Additionally, we're reducing left and right border so that it wouldn't overlap with the bottom and top borders,
  // otherwise, in case of opacity, there will be double border.
  const backgroundSize = `${left}${unit} calc(100% - ${top + bottom}${unit}), ${
    avoidCorners ? `calc(100% - ${left + right}${unit})` : '100%'
  } ${top}${unit}, ${right}${unit} calc(100% - ${top + bottom}${unit}), ${
    avoidCorners ? `calc(100% - ${left + right}${unit})` : '100%'
  } ${bottom}${unit}`;

  // Same here -- if the gap is assigned, we're ignoring the corners.
  // Same here for positioning -- we're positioning the left and right border not to overlap with the top and bottom.
  const backgroundPosition = `0 50%, ${
    avoidCorners ? '50%' : '0'
  } 0, 100% 50%, ${avoidCorners ? '50%' : '0'} 100%`;
  return {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    ...getBorderPositionCSS({ left, top, right, bottom, position }, unit),
    position: 'absolute',
    'background-image': `repeating-linear-gradient(0deg, ${color}, ${color} ${dash}px, transparent ${dash}px, transparent ${
      dash + gap
    }px, ${color} ${
      dash + gap
    }px), repeating-linear-gradient(90deg, ${color}, ${color} ${dash}px, transparent ${dash}px, transparent ${
      dash + gap
    }px, ${color} ${
      dash + gap
    }px), repeating-linear-gradient(180deg, ${color}, ${color} ${dash}px, transparent ${dash}px, transparent ${
      dash + gap
    }px, ${color} ${
      dash + gap
    }px), repeating-linear-gradient(270deg, ${color}, ${color} ${dash}px, transparent ${dash}px, transparent ${
      dash + gap
    }px, ${color} ${dash + gap}px)`,
    'background-size': backgroundSize,
    'background-position': backgroundPosition,
    'background-repeat': 'no-repeat',
  };
}
