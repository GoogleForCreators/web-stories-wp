/*
 * Copyright 2021 Google LLC
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
import { ElementType, getDefinitionForType } from '@googleforcreators/elements';
import type { Element, Mask } from '@googleforcreators/elements';
import type { CSSProperties } from 'react';

/**
 * Internal dependencies
 */
import { DEFAULT_MASK, MASKS } from './constants';

export function getElementMask({ type, mask }: Element) {
  if (mask?.type) {
    return MASKS.find((m) => m.type === mask.type);
  }
  return getDefaultElementMask(type);
}

// Only no-mask and masks with supportsBorder support border.
export function canMaskHaveBorder(element: Element) {
  const mask = getElementMask(element);
  return Boolean(!mask || mask.supportsBorder);
}

export function canSupportMultiBorder(element: Element) {
  const { mask } = element;
  return !mask || DEFAULT_MASK.type === mask?.type;
}

export function getMaskByType(type: string) {
  return MASKS.find((mask) => mask.type === type) || DEFAULT_MASK;
}

export function generateMaskId(element: Element, postfix: string) {
  const maskDef = getMaskByType(element?.mask?.type as string);
  return `mask-${maskDef.type}-${element.id}-${postfix}`;
}

function getDefaultElementMask(type: string) {
  if (!type) {
    return null;
  }
  const definition = getDefinitionForType(type as ElementType);
  return definition?.isMaskable ? DEFAULT_MASK : null;
}

/*
 * This constant and calculation concerns growing the element while shrinking
 * the inside SVG through viewbox so it overlaps the element correctly.
 * The math and logic is explained in this GH comment:
 * https://github.com/GoogleForCreators/web-stories-wp/pull/9851#issuecomment-1020461756
 */
const BORDER_MULTIPLIER = 3;
export function getBorderedMaskProperties(
  mask: Mask,
  borderWidth: number,
  elementWidth: number,
  elementHeight: number
) {
  const fullPadding = BORDER_MULTIPLIER * borderWidth;
  const relativeWidth = (elementWidth + fullPadding) / elementWidth;
  const relativeHeight = (elementHeight + fullPadding) / elementHeight;
  const offsetX = (relativeWidth - 1) / 2;
  const offsetY = (relativeHeight - 1) / 2;
  const scaledHeight = relativeHeight / (mask.ratio ?? 1);
  const viewBox = `0 0 ${relativeWidth} ${scaledHeight}`;
  const groupTransform = `translate(${offsetX},${offsetY})`;
  const borderWrapperStyle: CSSProperties = {
    width: `${relativeWidth * 100}%`,
    height: `${relativeHeight * 100}%`,
    position: 'absolute',
    left: `${-offsetX * 100}%`,
    top: `${-offsetY * 100}%`,
    pointerEvents: 'initial',
    display: 'block',
    zIndex: 1,
    opacity: 1,
  };
  return { viewBox, groupTransform, borderWrapperStyle };
}
