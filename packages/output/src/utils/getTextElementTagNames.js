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

const MINIMUM_CONTENT_LENGTH = 3;

/**
 * Returns a map of tag names for text elements.
 *
 * Uses a very simple algorithm to set tag name (h1, h2, h3, p)
 * based on font size.
 *
 * @param {Array<Object>} elements List of text elements
 * @param {string} newTag Chosen new tagName for text element
 * @return {Map<string, string>} Map of element IDs to tag name.
 */
function getTextElementTagNames(elements, newTag) {
  return elements
    .sort((a, b) => a.y - b.y)
    .reduce(
      /**
       * Reducer.
       *
       * @param {Map<string, string>} tagNamesMap Tag names map.
       * @param {Object} element Text element.
       * @param {string} element.id Element ID
       * @param {number} element.fontSize Font size.
       * @param {string} element.content Text content.
       * @param {string} element.tagName Existing tagName
       * @return {Map<string, string>} Tag names map.
       */
      (tagNamesMap, { id, fontSize, content, tagName }) => {
        // if a new tagName is added,
        // add it to the element
        if (newTag && newTag !== 'auto') {
          tagNamesMap.set(id, newTag);
          return tagNamesMap;
        }

        // if a tag already exists,
        // utilize the one already part of the element
        if (tagName && tagName !== 'auto') {
          tagNamesMap.set(id, tagName);
          return tagNamesMap;
        }

        if (content.length <= MINIMUM_CONTENT_LENGTH) {
          tagNamesMap.set(id, 'p');
          return tagNamesMap;
        }

        const hasH1 = Array.from(tagNamesMap.values()).includes('h1');

        if (fontSize >= 36 && !hasH1) {
          tagNamesMap.set(id, 'h1');
          return tagNamesMap;
        }

        if (fontSize >= 27) {
          tagNamesMap.set(id, 'h2');
        } else if (fontSize >= 21) {
          tagNamesMap.set(id, 'h3');
        } else {
          tagNamesMap.set(id, 'p');
        }

        return tagNamesMap;
      },
      new Map()
    );
}

export default getTextElementTagNames;
