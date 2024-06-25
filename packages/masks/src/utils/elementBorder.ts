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
import type {
  Border,
  BorderRadius,
  Element,
} from '@googleforcreators/elements';
import type { CSSObject } from 'styled-components';

/**
 * Internal dependencies
 */
import { canMaskHaveBorder, canSupportMultiBorder } from '../masks';

interface ElementWithBorder extends Element {
  border: Border;
}

function hasBorder(element: Element): element is ElementWithBorder {
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
  return !(!left && !top && !right && !bottom);
}

/**
 * Check if rectangular border should be displayed for an element.
 *
 * @param element Element object.
 * @return If should be displayed.
 */
export function shouldDisplayBorder(
  element: Element
): element is ElementWithBorder {
  return (
    hasBorder(element) &&
    canMaskHaveBorder(element) &&
    canSupportMultiBorder(element)
  );
}

interface SizeAndPosition {
  width: string;
  height: string;
  posTop: string;
  posLeft: string;
}

type BorderPositionProps = Border & Partial<SizeAndPosition>;

/**
 * Gets the CSS values for an element with border.
 *
 * @param obj An object with params relevant to border.
 * @param obj.left Left border width.
 * @param obj.top Top border width.
 * @param obj.right Right border width.
 * @param obj.bottom Bottom border width.
 * @param obj.width Original element width.
 * @param obj.height Original element height.
 * @param obj.posTop Element top position, needed for output mainly.
 * @param obj.posLeft Element left position, needed for output mainly.
 * @return Positioning CSS.
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
}: BorderPositionProps) {
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
 * @param element Element.
 * @return Border style.
 */
export function getBorderStyle(element: Element): CSSObject {
  // If there's no rectangular border, return the radius only.
  if (!hasBorder(element) || !canSupportMultiBorder(element)) {
    return getBorderRadius(element);
  }
  const { border } = element;
  const { left, top, right, bottom } = border;

  // We're making the border-width responsive just for the preview,
  // since the calculation is not 100% precise here, we're opting to the safe side by rounding the widths up
  // as opposed to having potential margin between the border and the element.
  // When not in preview, the rounding doesn't have any effect.
  const borderWidth = `${Math.ceil(top)}px ${Math.ceil(right)}px ${Math.ceil(
    bottom
  )}px ${Math.ceil(left)}px`;
  const borderStyle = {
    borderWidth,
    borderColor:
      border && border.color
        ? getBorderColor({ color: border.color })
        : undefined,
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

function getPercentage(value: number, fullValue: number) {
  if (!value || !fullValue) {
    return 0;
  }
  return (value / fullValue) * 100;
}

interface CornerPercentages {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

function getCornerPercentages(
  borderRadius: BorderRadius,
  measure: number
): CornerPercentages | string {
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
 * @param element Element.
 * @return Border radius value for CSS.
 */
export function getBorderRadius(element: Element) {
  const { borderRadius, width, height } = element;
  if (!borderRadius || !canSupportMultiBorder(element)) {
    return {};
  }
  /* We're using the format
    `border-radius: topLeft topRight bottomRight bottomLeft / topLeft topRight bottomRight bottomLeft`
    here so that we could convert one px value for border into % value which requires two values per each corner. */
  const wValues = getCornerPercentages(
    borderRadius,
    width
  ) as CornerPercentages;
  const hValues = getCornerPercentages(
    borderRadius,
    height
  ) as CornerPercentages;
  return {
    borderRadius: `${wValues.topLeft}% ${wValues.topRight}% ${wValues.bottomRight}% ${wValues.bottomLeft}% / ${hValues.topLeft}% ${hValues.topRight}% ${hValues.bottomRight}% ${hValues.bottomLeft}%`,
  };
}

/**
 * Gets the border color from rgba object.
 *
 * @param color Solid color object.
 * @param color.color Color object consisting rgba values.
 * @return rgba value for CSS.
 */
export function getBorderColor({ color }: Required<Pick<Border, 'color'>>) {
  // Border color can be only solid.
  const {
    color: { r, g, b, a },
  } = color;
  return `rgba(${r},${g},${b},${a === undefined ? 1 : a})`;
}

type Converter = (border: number) => number;

/**
 * Returns border values based on if it's preview or not.
 *
 * @param border Original border.
 * @param previewMode If it's preview mode.
 * @param converter Function to convert the border values.
 * @return New border values.
 */
export function getResponsiveBorder(
  border: Border,
  previewMode: boolean,
  converter: Converter
) {
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
