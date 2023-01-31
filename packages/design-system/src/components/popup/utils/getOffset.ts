/*
 * Copyright 2022 Google LLC
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
import type { RefObject } from 'react';

/**
 * Internal dependencies
 */
import { Placement } from '../constants';
import type { Offset, Spacing } from '../types';
import { getXTransforms, getYTransforms } from './getTransforms';

export function getXOffset(
  placement: Placement,
  spacing = 0,
  anchorRect: DOMRect,
  dockRect: DOMRect | undefined,
  isRTL: boolean
) {
  // doctRect.left can have a valid value of zero, if dockRect exists, it takes precedence.
  const leftAligned = (dockRect ? dockRect.left : anchorRect.left) - spacing;
  const rightAligned = (dockRect ? dockRect.right : anchorRect.right) + spacing;
  const centerAligned = dockRect
    ? dockRect.left + dockRect.width / 2
    : anchorRect.left + anchorRect.width / 2;

  switch (placement) {
    case Placement.BottomStart:
    case Placement.TopStart:
    case Placement.Left:
    case Placement.LeftEnd:
    case Placement.LeftStart:
      return isRTL ? rightAligned : leftAligned;
    case Placement.BottomEnd:
    case Placement.TopEnd:
    case Placement.Right:
    case Placement.RightEnd:
    case Placement.RightStart:
      return isRTL ? leftAligned : rightAligned;
    case Placement.Bottom:
    case Placement.Top:
      return centerAligned;
    default:
      return 0;
  }
}

export function getYOffset(
  placement: Placement,
  spacing = 0,
  anchorRect: DOMRect
) {
  switch (placement) {
    case Placement.Bottom:
    case Placement.BottomStart:
    case Placement.BottomEnd:
    case Placement.LeftEnd:
    case Placement.RightEnd:
      return anchorRect.top + anchorRect.height + spacing;
    case Placement.Top:
    case Placement.TopStart:
    case Placement.TopEnd:
    case Placement.LeftStart:
    case Placement.RightStart:
      return anchorRect.top - spacing;
    case Placement.Right:
    case Placement.Left:
      return anchorRect.top + anchorRect.height / 2;
    default:
      return 0;
  }
}

export const EMPTY_OFFSET = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  bodyRight: 0,
};

interface GetOffsetProps {
  placement: Placement;
  spacing?: Spacing;
  anchor: RefObject<Element>;
  dock?: RefObject<Element>;
  popup: RefObject<Element>;
  isRTL: boolean;
  ignoreMaxOffsetY?: boolean;
  offsetOverride?: boolean;
  topOffset?: number;
}

export function getOffset({
  placement,
  spacing,
  anchor,
  dock,
  popup,
  isRTL,
  ignoreMaxOffsetY,
  offsetOverride,
  topOffset = 0,
}: GetOffsetProps): Offset {
  if (!anchor.current) {
    return EMPTY_OFFSET;
  }
  const anchorRect = anchor.current.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();
  const popupRect = popup.current?.getBoundingClientRect();
  const dockRect = dock?.current?.getBoundingClientRect();

  // Adjust dimensions based on the popup content's inner dimensions
  if (popupRect) {
    popupRect.height = Math.max(
      popupRect.height,
      popup.current?.scrollHeight || 0
    );
    popupRect.width = Math.max(
      popupRect.width,
      popup.current?.scrollWidth || 0
    );
  }

  const { height = 0, width = 0 } = popupRect || {};
  const { x: spacingH = 0, y: spacingV = 0 } = spacing || {};

  // Horizontal
  const offsetX = getXOffset(placement, spacingH, anchorRect, dockRect, isRTL);

  const maxOffsetX = !isRTL
    ? bodyRect.width - width - getXTransforms(placement, isRTL) * width
    : bodyRect.width - getXTransforms(placement, isRTL) * width;

  // Vertical
  const offsetY = getYOffset(placement, spacingV, anchorRect);
  const maxOffsetY =
    bodyRect.height + bodyRect.y - height - getYTransforms(placement) * height;

  const offset = {
    width: anchorRect.width,
    height: anchorRect.height,
    bodyRight: bodyRect?.right,
  };

  // Clamp values
  return offsetOverride
    ? {
        x: offsetX,
        y: offsetY,
        ...offset,
      }
    : {
        x: Math.max(0, Math.min(offsetX, maxOffsetX)),
        y: ignoreMaxOffsetY
          ? offsetY
          : Math.max(topOffset, Math.min(offsetY, maxOffsetY)),
        ...offset,
      };
}
