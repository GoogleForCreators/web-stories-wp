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
import type { Resource } from './types';
import aspectRatiosApproximatelyMatch from './aspectRatiosApproximatelyMatch';

/**
 * Choose the source URL of the smallest available size image / video wider than
 * minWidth, according to the device pixel ratio.
 *
 * @param minWidth The minimum width of the thumbnail to return.
 * @param resource The resource.
 * @return Source URL of the smallest available size media.
 */
function getSmallestUrlForWidth(minWidth: number, resource: Resource): string {
  if (resource.sizes) {
    const smallestMedia = Object.values(resource.sizes)
      .sort((s1, s2) => s1.width - s2.width)
      .filter((s) => aspectRatiosApproximatelyMatch(s, resource))
      .find((s) => s.width >= minWidth * window.devicePixelRatio);
    if (smallestMedia) {
      return smallestMedia.sourceUrl;
    }
  }
  return resource.src;
}

export default getSmallestUrlForWidth;
