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
import { getXTransforms, getYTransforms } from './getTransforms';

export function getXOffset(
  placement,
  spacing = 0,
  anchorRect,
  dockRect,
  bodyRect
) {
  switch (placement) {
    case PLACEMENT.BOTTOM_START:
    case PLACEMENT.TOP_START:
    case PLACEMENT.LEFT:
    case PLACEMENT.LEFT_END:
    case PLACEMENT.LEFT_START:
      return bodyRect.left + (dockRect?.left || anchorRect.left) - spacing;
    case PLACEMENT.BOTTOM_END:
    case PLACEMENT.TOP_END:
    case PLACEMENT.RIGHT:
    case PLACEMENT.RIGHT_END:
    case PLACEMENT.RIGHT_START:
      return (
        bodyRect.left +
        (dockRect?.left || anchorRect.left) +
        anchorRect.width +
        spacing
      );
    case PLACEMENT.BOTTOM:
    case PLACEMENT.TOP:
      return (
        bodyRect.left +
        (dockRect?.left || anchorRect.left) +
        anchorRect.width / 2
      );
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

  const { height = 0, width = 0 } = popupRect || {};
  const { x: spacingH = 0, y: spacingV = 0 } = spacing || {};

  // Horizontal
  const offsetX = getXOffset(
    placement,
    spacingH,
    anchorRect,
    dockRect,
    bodyRect
  );
  const maxOffsetX = bodyRect.width - width - getXTransforms(placement) * width;

  // Vertical
  const offsetY = getYOffset(placement, spacingV, anchorRect);
  const maxOffsetY =
    bodyRect.height + bodyRect.y - height - getYTransforms(placement) * height;

  // Clamp values
  return {
    x: Math.max(0, Math.min(offsetX, maxOffsetX)),
    y: Math.max(0, Math.min(offsetY, maxOffsetY)),
    width: anchorRect.width,
    height: anchorRect.height,
  };
}
