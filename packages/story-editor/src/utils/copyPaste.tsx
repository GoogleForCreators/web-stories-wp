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

import type { Page, Element } from '@googleforcreators/elements';
import type { StoryAnimation } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import generateGroupName from './generateGroupName';

const DOUBLE_DASH_ESCAPE = '_DOUBLEDASH_';

interface GroupsProps {
  [key: string]: {
    name?: string;
  };
}

interface PayloadProps {
  sentinel: string;
  items: Elements[];
  animations: StoryAnimation[];
  groups: GroupsProps;
}

interface ProcessedPayloadProps {
  animations: StoryAnimation[];
  elements: Element[];
}
/**
 * Processes pasted content to find story elements.
 *
 * @param content NodeList representation of the content.
 * @param           currentPage Current page.
 * @return Object containing found elements and animations arrays.
 */
export function processPastedElements(
  content: DocumentFragment,
  currentPage: Page
) {
  let foundElementsAndAnimations: {
    animations: StoryAnimation[];
    elements: Element[];
    groups: GroupsProps;
  } = { animations: [], elements: [], groups: {} };
  for (let n = content.firstChild; n; n = n.nextSibling) {
    if (
      n.nodeType !== /* COMMENT */ 8 ||
      (typeof n.nodeValue === 'string' &&
        n.nodeValue?.indexOf('Fragment') !== -1)
    ) {
      continue;
    }
    const payload: PayloadProps = JSON.parse(
      n.nodeValue.replace(new RegExp(DOUBLE_DASH_ESCAPE, 'g'), '--')
    ) as PayloadProps;
    if (payload.sentinel !== 'story-elements') {
      continue;
    }

    const processedPayload: ProcessedPayloadProps = payload.items.reduce(
      (
        { elements, animations }: ProcessedPayloadProps,
        payloadElement: Element
      ) => {
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
    ) as ProcessedPayloadProps;

    const groups = { ...payload.groups };
    for (const prop of Object.keys(groups)) {
      groups[prop].name = generateGroupName(groups, groups[prop].name);
    }

    foundElementsAndAnimations = {
      animations: [
        ...foundElementsAndAnimations.animations,
        ...processedPayload.animations,
      ],
      elements: [
        ...foundElementsAndAnimations.elements,
        ...processedPayload.elements,
      ],
      groups: groups,
    };
    return foundElementsAndAnimations;
  }
  return foundElementsAndAnimations;
}

/**
 * Processes copied/cut content for preparing elements to add to clipboard.
 *
 * @param page Page which all the elements belong to.
 * @param elements Array of story elements.
 * @param animations Array of story animations.
 * @param groups Array of page groups used in the elements.
 * @param evt Copy/cut event object.
 */
export function addElementsToClipboard(
  page: Page,
  elements: Element[],
  animations: StoryAnimation[],
  groups: GroupsProps,
  evt: ClipboardEvent
) {
  if (!elements.length || !evt) {
    return;
  }
  const { clipboardData } = evt;
  const payload: PayloadProps = {
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
