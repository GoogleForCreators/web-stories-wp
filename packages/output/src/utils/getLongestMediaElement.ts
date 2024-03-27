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
  elementIs,
  type SequenceMediaElement,
  type VideoElement,
  type Element,
} from '@googleforcreators/elements';

/**
 * Among all elements, returns the media element with the longest duration.
 *
 * @param elements List of elements.
 * @param minDuration Duration that the minimum element must exceed in seconds.
 * @return Found element, or undefined if there are no media elements.
 */
function getLongestMediaElement(
  elements: Element[],
  minDuration = 0
): SequenceMediaElement | undefined {
  return elements
    .filter(elementIs.video)
    .filter(({ loop, isHidden }) => {
      // Ensure looping media is not considered.
      return !loop && !isHidden;
    })
    .reduce((longest: VideoElement | undefined, element) => {
      if (!element?.resource.length) {
        return longest;
      }

      if (element?.resource?.length < minDuration) {
        return longest;
      }

      if (!longest) {
        return element;
      }

      return longest?.resource?.length > element?.resource?.length
        ? longest
        : element;
    }, undefined);
}

export default getLongestMediaElement;
