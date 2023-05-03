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
  elementIs,
} from '@googleforcreators/elements';
import type { Groups, Element, Page } from '@googleforcreators/elements';
import type { StoryAnimation } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import generateGroupName from './generateGroupName';

const DOUBLE_DASH_ESCAPE = '_DOUBLEDASH_';

interface ProcessPastedElementsReturn {
  animations: StoryAnimation[];
  elements: Element[];
  groups?: Groups;
}

interface Payload {
  sentinel?: string;
  items?: Element[];
  groups?: Groups;
  animations?: StoryAnimation[];
  selectedElements?: Element[];
}
/**
 * Processes pasted content to find story elements.
 */
export function processPastedElements(
  content: DocumentFragment,
  currentPage: Page,
  selectedElements?: Element[]
): ProcessPastedElementsReturn {
  let foundElementsAndAnimations: ProcessPastedElementsReturn = {
    animations: [],
    elements: [],
  };
  for (let n = content.firstChild; n; n = (n as ChildNode).nextSibling) {
    if (
      n.nodeType !== /* COMMENT */ 8 ||
      n.nodeValue?.indexOf('Fragment') !== -1
    ) {
      continue;
    }
    const payload = JSON.parse(
      n.nodeValue.replace(new RegExp(DOUBLE_DASH_ESCAPE, 'g'), '--')
    ) as Payload;
    if (payload.sentinel !== 'story-elements' || !payload.items) {
      continue;
    }

    const processedPayload = payload.items.reduce(
      (
        {
          elements,
          animations,
        }: { elements: Element[]; animations: StoryAnimation[] },
        payloadElement: Element,
        ind: number
      ) => {
        const offsetBase =
          selectedElements && selectedElements[ind]
            ? {
                x: selectedElements[ind].x,
                y: selectedElements[ind].y,
              }
            : undefined;
        const { element, elementAnimations } = duplicateElement({
          element: payloadElement,
          animations: payload.animations,
          currentElements: currentPage.elements,
          offsetBase,
        });

        return {
          elements: [...elements, element],
          animations: [...animations, ...elementAnimations],
        };
      },
      { animations: [], elements: [] }
    );

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
 */
export function addElementsToClipboard(
  page: Page,
  elements: Element[],
  animations: StoryAnimation[],
  groups: Groups,
  evt: ClipboardEvent
) {
  if (!elements.length || !evt) {
    return;
  }
  const { clipboardData } = evt;
  if (!clipboardData) {
    return;
  }
  const payload = {
    sentinel: 'story-elements',
    // @todo: Ensure that there's no unserializable data here. The easiest
    // would be to keep all serializable data together and all non-serializable
    // in a separate property.
    items: elements.map((element) => ({
      ...element,
      ...(elementIs.defaultBackground(element)
        ? { backgroundColor: page.backgroundColor }
        : null),
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
          flags={{}}
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
