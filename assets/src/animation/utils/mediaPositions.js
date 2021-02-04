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
 * Internal dependencies
 */
import {
  FULLBLEED_RATIO,
  PAGE_HEIGHT,
  PAGE_WIDTH,
} from '../../edit-story/constants';
import getMediaSizePositionProps from '../../edit-story/elements/media/getMediaSizePositionProps';
import { getBox } from '../../edit-story/units/dimensions';

const FULLBLEED_PAGE_HEIGHT = (1 / FULLBLEED_RATIO) * PAGE_WIDTH;
const PRECISION = 1;

export function getMediaBoundOffsets({ element }) {
  // Get elements box based on a given page size with proper ratio.
  const box = getBox(element, PAGE_WIDTH, PAGE_HEIGHT);
  // Calculate image offsets based off given box, focal point
  const media = getMediaSizePositionProps(
    element.resource,
    box.width,
    box.height,
    element.scale,
    element.focalX,
    element.focalY
  );

  return {
    top: (media.offsetY / media.height) * 100,
    right:
      -1 * ((media.width - (media.offsetX + PAGE_WIDTH)) / media.width) * 100,
    left: (media.offsetX / media.width) * 100,
    bottom:
      -1 *
      ((media.height - (media.offsetY + FULLBLEED_PAGE_HEIGHT)) /
        media.height) *
      100,
  };
}

function mapValues(obj, op) {
  return Object.entries(obj).reduce((accum, [key, val]) => {
    accum[key] = op(val);
    return accum;
  }, {});
}

export function hasOffsets({ element }) {
  const offsets = getMediaBoundOffsets({ element });
  return mapValues(offsets, (offset) => Math.abs(offset) > PRECISION);
}
