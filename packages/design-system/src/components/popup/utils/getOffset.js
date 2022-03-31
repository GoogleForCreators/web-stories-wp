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
 * Internal dependencies
 */
import { PLACEMENT } from '../constants';
import { getXTransforms, getYTransforms } from './getTransforms';
export function getXOffset(
  placement,
  spacing = 0,
  anchorRect,
  dockRect,
  isRTL
) {
  // doctRect.left can have a valid value of zero, if dockRect exists, it takes precedence.
  const leftAligned = (dockRect ? dockRect.left : anchorRect.left) - spacing;
  const rightAligned = (dockRect ? dockRect.right : anchorRect.right) + spacing;
  const centerAligned = dockRect
    ? dockRect.left + dockRect.width / 2
    : anchorRect.left + anchorRect.width / 2;

  switch (placement) {
    case PLACEMENT.BOTTOM_START:
    case PLACEMENT.TOP_START:
    case PLACEMENT.LEFT:
    case PLACEMENT.LEFT_END:
    case PLACEMENT.LEFT_START:
      return isRTL ? rightAligned : leftAligned;
    case PLACEMENT.BOTTOM_END:
    case PLACEMENT.TOP_END:
    case PLACEMENT.RIGHT:
    case PLACEMENT.RIGHT_END:
    case PLACEMENT.RIGHT_START:
      return isRTL ? leftAligned : rightAligned;
    case PLACEMENT.BOTTOM:
    case PLACEMENT.TOP:
      return centerAligned;
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
 * @param {Object} args args passed to getOffset
 * @param {string} args.placement Placement.
 * @param {Spacing} args.spacing Spacing.
 * @param {MutableRefObject<HTMLElement>} args.anchor Anchor element
 * @param {MutableRefObject<HTMLElement>} args.dock Dock element.
 * @param {MutableRefObject<HTMLElement>} args.popup Popup element.
 * @param {boolean} args.isRTL isRTL.
 * @param {number} args.topOffset Header Offset.
 * @param {boolean} args.ignoreMaxOffsetY Defaults to false. Sometimes, we want the popup to respect the y value
 * as perceived by the page because of scroll. This is really only true of dropDowns that
 * exist beyond the initial page scroll. Because the editor is a fixed view this only
 * comes up in peripheral pages (dashboard, settings).
 * @param {boolean} args.resetXOffset tooltips (which use Popup) can dynamically adjust `placement` when rendered
 * off screen, eg. when in RTL. However, when using Popup directly, we can run into it being rendered off screen
 * when in RTL. Flag is sent via `Popup` which will determine whether or not we should force the X offset to zero
 * or width of popup.
 * @return {Offset} Popup offset.
 */
export function getOffset({
  placement,
  spacing,
  anchor,
  dock,
  popup,
  isRTL,
  topOffset = 0, // set default then we won't have to send it in with Tooltip
  ignoreMaxOffsetY,
  resetXOffset,
}) {
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
  const offsetX = () => {
    // resetXOffset was added because the layers panel popup is getting weird x values in the negative range. So if we
    // just check for popupRect.left <= 0 we end up pushing the tooltips inside the layers panel off to the edge. We
    // should figure out why the layer's panel is getting whacked values.
    if (resetXOffset && popupRect && popupRect.left <= 0) {
      return isRTL ? width : 0;
    }
    return getXOffset(placement, spacingH, anchorRect, dockRect, isRTL);
  };
  const maxOffsetX = bodyRect.width - width - getXTransforms(placement) * width;

  // Vertical
  const offsetY = getYOffset(placement, spacingV, anchorRect);
  const maxOffsetY =
    bodyRect.height + bodyRect.y - height - getYTransforms(placement) * height;

  // Clamp values
  return {
    x: Math.max(0, Math.min(offsetX(), maxOffsetX)),
    y: ignoreMaxOffsetY
      ? offsetY
      : Math.max(topOffset, Math.min(offsetY, maxOffsetY)),
    width: anchorRect.width,
    height: anchorRect.height,
    popupLeft: popupRect?.left,
    popupHeight: popupRect?.height,
  };
}
