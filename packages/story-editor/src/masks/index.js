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
 * Internal dependencies
 */
import { getDefinitionForType } from '../elements';
import { DEFAULT_MASK, MASKS } from './constants';

export function getElementMask({ type, mask }) {
  if (mask?.type) {
    return MASKS.find((m) => m.type === mask.type);
  }
  return getDefaultElementMask(type);
}

// Only no-mask and masks with supportsBorder support border.
export function canMaskHaveBorder(element) {
  const mask = getElementMask(element);
  return !mask || mask.supportsBorder;
}

export function checkMultiBorderSupport(element) {
  const { mask } = element;
  return !mask || DEFAULT_MASK.type === mask?.type;
}

export function getMaskByType(type) {
  return MASKS.find((mask) => mask.type === type) || DEFAULT_MASK;
}

function getDefaultElementMask(type) {
  if (!type) {
    return null;
  }
  const { isMaskable } = getDefinitionForType(type);
  return isMaskable ? DEFAULT_MASK : null;
}

const BORDER_MULTIPLIER = 3;
export function getBorderedMaskProperties(
  mask,
  borderWidth,
  elementWidth,
  elementHeight
) {
  const fullPadding = BORDER_MULTIPLIER * borderWidth;
  const relativeWidth = (elementWidth + fullPadding) / elementWidth;
  const relativeHeight = (elementHeight + fullPadding) / elementHeight;
  const offsetX = (relativeWidth - 1) / 2;
  const offsetY = (relativeHeight - 1) / 2;
  const scaledHeight = relativeHeight / mask.ratio;
  const relativeBorderWidth =
    (2 / BORDER_MULTIPLIER) * Math.max(offsetX, offsetY);
  const viewBox = `0 0 ${relativeWidth} ${scaledHeight}`;
  const groupTransform = `translate(${offsetX},${offsetY})`;
  const borderWrapperStyle = {
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
  return { viewBox, groupTransform, borderWrapperStyle, relativeBorderWidth };
}
