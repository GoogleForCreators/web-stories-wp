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
  dataPixels,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  DEFAULT_DPR,
} from '@googleforcreators/units';
import { getDefinitionForType } from '@googleforcreators/elements';

const RESIZE_WIDTH_DIRECTION = [1, 0];

/**
 * @param {?number|undefined} value The value.
 * @return {boolean} Whether the value has been set.
 */
function isNum(value) {
  return typeof value === 'number';
}

function getInsertedElementSize(
  type,
  width,
  height,
  attrs,
  ratio = 1,
  resource = null
) {
  const { updateForResizeEvent, defaultAttributes } =
    getDefinitionForType(type);

  if (!isNum(width)) {
    if (isNum(height)) {
      // Height is known: use aspect ratio.
      width = height * ratio;
    } else if (resource) {
      // Resource is available: take resource's width with DPR, but limit
      // to fit on the page (80% max).
      width = Math.min(resource.width * DEFAULT_DPR, PAGE_WIDTH * 0.8);
    } else {
      // Default to half of page.
      width = PAGE_WIDTH / 2;
    }
  }
  if (!isNum(height) && updateForResizeEvent) {
    // Try resize API with width-only direction.
    height = updateForResizeEvent(
      {
        ...defaultAttributes,
        ...attrs,
      },
      RESIZE_WIDTH_DIRECTION,
      width
    ).height;
  }
  if (!isNum(height)) {
    // Fallback to simple ratio calculation.
    height = width / ratio;
  }

  // Ensure that the element fits on the page.
  if (width > PAGE_WIDTH || height > PAGE_HEIGHT) {
    const pageRatio = PAGE_WIDTH / PAGE_HEIGHT;
    const newRatio = width / height;
    if (newRatio <= pageRatio) {
      width = Math.min(width, PAGE_WIDTH);
      height = width / newRatio;
    } else {
      height = Math.min(height, PAGE_HEIGHT);
      width = height * newRatio;
    }
  }
  width = dataPixels(width);
  height = dataPixels(height);
  return { width, height };
}

export default getInsertedElementSize;
