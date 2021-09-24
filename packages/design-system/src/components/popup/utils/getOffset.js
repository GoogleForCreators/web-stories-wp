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
import { PLACEMENT } from '../constants';
import { getXTransforms } from './getTransforms';

export function getXOffset(placement, spacing = 0, anchorRect, dockRect) {
  switch (placement) {
    case PLACEMENT.BOTTOM_START:
    case PLACEMENT.TOP_START:
    case PLACEMENT.LEFT:
    case PLACEMENT.LEFT_END:
    case PLACEMENT.LEFT_START:
      return (dockRect?.left || anchorRect.left) - spacing;
    case PLACEMENT.BOTTOM_END:
    case PLACEMENT.TOP_END:
    case PLACEMENT.RIGHT:
    case PLACEMENT.RIGHT_END:
    case PLACEMENT.RIGHT_START:
      return (dockRect?.left || anchorRect.left) + anchorRect.width + spacing;
    case PLACEMENT.BOTTOM:
    case PLACEMENT.TOP:
      return (dockRect?.left || anchorRect.left) + anchorRect.width / 2;
    default:
      return 0;
  }
}

export function getYOffset(placement, spacing = 0, anchorRect) {
  switch (placement) {
    case PLACEMENT.BOTTOM:
    case PLACEMENT.BOTTOM_START:
    case PLACEMENT.BOTTOM_END:
    case PLACEMENT.LEFT_END:
    case PLACEMENT.RIGHT_END:
      return anchorRect.top + anchorRect.height + spacing;
    case PLACEMENT.TOP:
    case PLACEMENT.TOP_START:
    case PLACEMENT.TOP_END:
    case PLACEMENT.LEFT_START:
    case PLACEMENT.RIGHT_START:
      return anchorRect.top - spacing;
    case PLACEMENT.RIGHT:
    case PLACEMENT.LEFT:
      return anchorRect.top + anchorRect.height / 2;
    default:
      return 0;
  }
}

/** @typedef {import('react').MutableRefObject} MutableRefObject */

/**
 * @typedef {Object} Spacing Spacing
 * @property {number} x Horizontal spacing.
 * @property {number} y Vertical spacing.
 */
/**
 * @typedef {Object} Offset Offset
 * @property {number} x Horizontal position.
 * @property {number} y Vertical position.
 * @property {number} width Width.
 * @property {number} height Height.
 */

/**
 *
 * @param {string} placement Placement.
 * @param {Spacing} spacing Spacing.
 * @param {MutableRefObject<HTMLElement>} anchor Anchor element
 * @param {MutableRefObject<HTMLElement>} dock Dock element.
 * @param {MutableRefObject<HTMLElement>} popup Popup element.
 * @return {Offset} Popup offset.
 */
export function getOffset(placement, spacing, anchor, dock, popup) {
  const anchorRect = anchor.current.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();
  const popupRect = popup.current?.getBoundingClientRect();
  const dockRect = dock?.current?.getBoundingClientRect();
  // Adjust dimensions based on the popup content's inner dimensions
  if (popupRect) {
    popupRect.height = Math.max(popupRect.height, popup.current?.scrollHeight);
    popupRect.width = Math.max(popupRect.width, popup.current?.scrollWidth);
  }

  const { width = 0 } = popupRect || {};
  const { x: spacingH = 0, y: spacingV = 0 } = spacing || {};

  // Horizontal
  const offsetX = getXOffset(placement, spacingH, anchorRect, dockRect);
  const maxOffsetX = bodyRect.width - width - getXTransforms(placement) * width;

  // Vertical
  // We always want just the pure offset of Y because if anything scrolls (panels or the window) we want that position to stay true to the anchor.
  // This prevents any overlap of labels on scroll with an open popup.
  const offsetY = getYOffset(placement, spacingV, anchorRect);

  // Clamp X value
  return {
    x: Math.max(0, Math.min(offsetX, maxOffsetX)),
    y: offsetY,
    width: anchorRect.width,
    height: anchorRect.height,
    // We want to know where the popRect container stops before scrolling begins
    bottom: popupRect?.bottom,
  };
}
