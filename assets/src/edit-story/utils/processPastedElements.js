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
import { v4 as uuidv4 } from 'uuid';

const DOUBLE_DASH_ESCAPE = '_DOUBLEDASH_';

/**
 * Processes pasted content to find story elements.
 *
 * @param {string} content
 * @param {Object} currentPage
 * @return {[]} Array of found elements.
 */
function processPastedElements(content, currentPage) {
  let foundElements = [];
  for (let n = content.firstChild; n; n = n.nextSibling) {
    if (n.nodeType !== /* COMMENT */ 8) {
      continue;
    }
    const payload = JSON.parse(
      n.nodeValue.replace(new RegExp(DOUBLE_DASH_ESCAPE, 'g'), '--')
    );
    if (payload.sentinel !== 'story-elements') {
      continue;
    }
    foundElements = [
      ...foundElements,
      ...payload.items.map(({ x, y, basedOn, ...rest }) => {
        currentPage.elements.forEach((element) => {
          if (element.id === basedOn || element.basedOn === basedOn) {
            x = Math.max(x, element.x + 60);
            y = Math.max(y, element.y + 60);
          }
        });
        return {
          ...rest,
          basedOn,
          id: uuidv4(),
          x,
          y,
        };
      }),
    ];
    return foundElements;
  }
  return foundElements;
}

export default processPastedElements;
