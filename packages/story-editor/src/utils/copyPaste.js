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
import { renderToStaticMarkup } from '@googleforcreators/react';
import {
  getDefinitionForType,
  duplicateElement,
} from '@googleforcreators/elements';

const DOUBLE_DASH_ESCAPE = '_DOUBLEDASH_';

/**
 * Processes pasted content to find story elements.
 *
 * @param {DocumentFragment} content NodeList representation of the content.
 * @param {Object}           currentPage Current page.
 * @return {Object} Object containing found elements and animations arrays.
 */
export function processPastedElements(content, currentPage) {
  let foundElementsAndAnimations = { animations: [], elements: [] };
  for (let n = content.firstChild; n; n = n.nextSibling) {
    if (
      n.nodeType !== /* COMMENT */ 8 ||
      n.nodeValue?.indexOf('Fragment') !== -1
    ) {
      continue;
    }
    const payload = JSON.parse(
      n.nodeValue.replace(new RegExp(DOUBLE_DASH_ESCAPE, 'g'), '--')
    );
    if (payload.sentinel !== 'story-elements') {
      continue;
    }

    const processedPayload = payload.items.reduce(
      ({ elements, animations }, payloadElement) => {
        const { element, elementAnimations } = duplicateElement({
          element: {
            ...payloadElement,
            id: payloadElement.basedOn,
          },
          animations: payload.animations,
          existingElements: currentPage.elements,
        });

        return {
          elements: [...elements, element],
          animations: [...animations, ...elementAnimations],
        };
      },
      { animations: [], elements: [] }
    );

    foundElementsAndAnimations = {
      animations: [
        ...foundElementsAndAnimations.animations,
        ...processedPayload.animations,
      ],
      elements: [
        ...foundElementsAndAnimations.elements,
        ...processedPayload.elements,
      ],
      groups: payload.groups,
    };
    return foundElementsAndAnimations;
  }
  return foundElementsAndAnimations;
}

/**
 * Processes copied/cut content for preparing elements to add to clipboard.
 *
 * @param {Object} page Page which all the elements belong to.
 * @param {Array} elements Array of story elements.
 * @param {Array} animations Array of story animations.
 * @param {Array} groups Array of page groups used in the elements.
 * @param {Object} evt Copy/cut event object.
 */
export function addElementsToClipboard(
  page,
  elements,
  animations,
  groups,
  evt
) {
  if (!elements.length || !evt) {
    return;
  }
  const { clipboardData } = evt;
  const payload = {
    sentinel: 'story-elements',
    // @todo: Ensure that there's no unserializable data here. The easiest
    // would be to keep all serializable data together and all non-serializable
    // in a separate property.
    items: elements.map((element) => ({
      ...element,
      ...(element.isDefaultBackground
        ? { backgroundColor: page.backgroundColor }
        : null),
      basedOn: element.id,
      id: undefined,
    })),
    animations,
    groups,
  };
  const serializedPayload = JSON.stringify(payload).replace(
    /--/g,
    DOUBLE_DASH_ESCAPE
  );

  const textContent = elements
    .map((el) => {
      const { type } = el;
      const { TextContent } = getDefinitionForType(type);
      if (TextContent) {
        return TextContent(el);
      }
      return type;
    })
    .join('\n');

  const htmlContent = elements
    .map((el) => {
      const { type, x, y, rotationAngle } = el;
      const { Output } = getDefinitionForType(type);
      return renderToStaticMarkup(
        <Output
          element={el}
          box={{ width: 100, height: 100, x, y, rotationAngle }}
        />
      );
    })
    .join('\n');

  clipboardData.setData('text/plain', textContent);
  clipboardData.setData(
    'text/html',
    `<!-- ${serializedPayload} -->${htmlContent}`
  );
}
