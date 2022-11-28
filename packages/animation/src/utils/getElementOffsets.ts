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
import { getMediaSizePositionProps, Resource } from '@googleforcreators/media';
import {
  getBox,
  FULLBLEED_HEIGHT,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  DimensionableElement,
} from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import type { ScaledElement } from '../types';

// This type also exists in the elements package, but it doesn't
// really make sense to reuse this one there. This is only for internal
// use in this file.
interface MediaElement extends ScaledElement {
  resource: Resource;
  focalX?: number;
  focalY?: number;
}

const PRECISION = 1;

function isMediaElement(e: DimensionableElement): e is MediaElement {
  return 'resource' in e;
}

export function getElementOffsets(element: DimensionableElement) {
  if (!isMediaElement(element)) {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  // Get elements box based on a given page size with proper ratio.
  const box = getBox(element, PAGE_WIDTH, PAGE_HEIGHT);
  // Calculate media offsets based off given box, focal point
  const media = getMediaSizePositionProps(
    element.resource,
    box.width,
    box.height,
    element.scale ?? 1,
    element.focalX ?? 50,
    element.focalY ?? 50
  );

  return {
    top: (media.offsetY / media.height) * 100,
    right:
      -1 * ((media.width - (media.offsetX + PAGE_WIDTH)) / media.width) * 100,
    left: (media.offsetX / media.width) * 100,
    bottom:
      -1 *
      ((media.height - (media.offsetY + FULLBLEED_HEIGHT)) / media.height) *
      100,
  };
}

export const DEFAULT_HAS_OFFSETS = {
  top: false,
  bottom: false,
  left: false,
  right: false,
};

export function getHasElementOffsets(element: DimensionableElement) {
  const offsets = getElementOffsets(element);
  return Object.fromEntries(
    Object.entries(offsets).map(([key, offset]) => [
      key,
      Math.abs(offset) > PRECISION,
    ])
  );
}

/**
 * Given a media element, calculates where the origin is on the media
 * relative to it's frame, such that scaling the media up or down
 * (with the given transform-origin) most optimistically tries to
 * fill the frame
 *
 * @param offsets Media element offsets
 * @return object containing horizontal and vertical transform origin percentages
 */
export function getElementOrigin(
  offsets = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
) {
  // If both offsets are 0, we want the origin to be in the middle.
  // Otherwise we want the percentage of one offset relative to the
  // other
  const progress = {
    vertical: 50,
    horizontal: 50,
  };
  const absOffsets = Object.fromEntries(
    Object.entries(offsets).map(([key, val]) => [key, Math.abs(val)])
  );
  const isSignificant = (val: number) => val >= 0.01;
  if ([absOffsets.top, absOffsets.bottom].some(isSignificant)) {
    progress.vertical =
      (100 * absOffsets.top) / (absOffsets.top + absOffsets.bottom);
  }
  if ([absOffsets.left, absOffsets.right].some(isSignificant)) {
    progress.horizontal =
      (100 * absOffsets.left) / (absOffsets.left + absOffsets.right);
  }

  return progress;
}
