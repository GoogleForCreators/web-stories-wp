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
import { getDefinitionForType } from '../../elements';

/**
 * Among all elements, returns the media element with the longest duration.
 *
 * @param {Array<Object>} elements List of elements.
 * @param {number} minDuration Duration that the minimum element must exceed in seconds.
 * @return {Object|undefined} Found element, or undefined if there are no media elements.
 */
function getLongestMediaElement(elements, minDuration = 0) {
  return elements
    .filter(({ type, loop }) => {
      const { isMedia } = getDefinitionForType(type);
      // Ensure looping media is not considered.
      return isMedia && !loop;
    })
    .reduce((longest, element) => {
      if (!element?.resource?.length) {
        return longest;
      }

      if (element?.resource?.length < minDuration) {
        return longest;
      }

      return longest?.resource?.length > element?.resource?.length
        ? longest
        : element;
    }, undefined);
}

export default getLongestMediaElement;
