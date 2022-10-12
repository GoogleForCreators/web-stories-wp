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
import {
  getBox,
  FULLBLEED_HEIGHT,
  PAGE_HEIGHT,
  PAGE_WIDTH,
} from '@googleforcreators/units';
import { getMediaSizePositionProps } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import type { Element, MediaElement } from '../types';

const PRECISION = 1;

function isMediaElement(e: Element): e is MediaElement {
  return 'resource' in e;
}

export function getElementOffsets(element: Element) {
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

function mapValues<K, T>(obj: Record<string, K>, op: (n: K) => T) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, op(val)])
  );
}

export const DEFAULT_HAS_OFFSETS = {
  top: false,
  bottom: false,
  left: false,
  right: false,
};

export function getHasElementOffsets(element: Element) {
  const offsets = getElementOffsets(element);
  return mapValues(offsets, (offset) => Math.abs(offset) > PRECISION);
}
