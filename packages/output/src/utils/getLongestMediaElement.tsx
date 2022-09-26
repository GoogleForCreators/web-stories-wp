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
import { getDefinitionForType } from '@googleforcreators/elements';
import type { Element, VideoElement } from '@googleforcreators/types';

/**
 * Among all elements, returns the media element with the longest duration.
 */
function getLongestMediaElement(elements: Element[], minDuration = 0): Element {
  const videoElements = elements as VideoElement[];
  return videoElements
    .filter(({ type, loop }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call -- Needs fixing in elements library
      const { isMedia } = getDefinitionForType(type);
      // Ensure looping media is not considered.
      return isMedia && !loop;
    })
    .reduce((longest: VideoElement, element: VideoElement) => {
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
