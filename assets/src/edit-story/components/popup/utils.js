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
import { Placement } from '.';

export function getXTransforms(placement) {
  // left & right
  if (placement.startsWith('left')) {
    return -1;
  } else if (placement.startsWith('right')) {
    return null;
  }
  // top & bottom
  if (placement.endsWith('-start')) {
    return null;
  } else if (placement.endsWith('-end')) {
    return -1;
  }
  return -0.5;
}

export function getYTransforms(placement) {
  if (
    placement.startsWith('top') ||
    placement === Placement.RIGHT_END ||
    placement === Placement.LEFT_END
  ) {
    return -1;
  }
  if (placement === Placement.RIGHT || placement === Placement.LEFT) {
    return -0.5;
  }
  return null;
}

// note that we cannot use percentage values for transforms, which
// do not work correctly for rotated elements
export function getTransforms(placement) {
  const xTransforms = getXTransforms(placement);
  const yTransforms = getYTransforms(placement);
  if (!xTransforms && !yTransforms) {
    return '';
  }
  return `translate(${(xTransforms || 0) * 100}%, ${
    (yTransforms || 0) * 100
  }%)`;
}

export function getXOffset(
  placement,
  spacing = 0,
  anchorRect,
  dockRect,
  bodyRect
) {
  switch (placement) {
    case Placement.BOTTOM_START:
    case Placement.TOP_START:
    case Placement.LEFT:
    case Placement.LEFT_END:
    case Placement.LEFT_START:
      return bodyRect.left + (dockRect?.left || anchorRect.left) - spacing;
    case Placement.BOTTOM_END:
    case Placement.TOP_END:
    case Placement.RIGHT:
    case Placement.RIGHT_END:
    case Placement.RIGHT_START:
      return (
        bodyRect.left +
        (dockRect?.left || anchorRect.left) +
        anchorRect.width +
        spacing
      );
    case Placement.BOTTOM:
    case Placement.TOP:
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
    case Placement.BOTTOM:
    case Placement.BOTTOM_START:
    case Placement.BOTTOM_END:
    case Placement.LEFT_END:
    case Placement.RIGHT_END:
      return anchorRect.top + anchorRect.height + spacing;
    case Placement.TOP:
    case Placement.TOP_START:
    case Placement.TOP_END:
    case Placement.LEFT_START:
    case Placement.RIGHT_START:
      return anchorRect.top - spacing;
    case Placement.RIGHT:
    case Placement.LEFT:
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
