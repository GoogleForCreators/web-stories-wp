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
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Internal dependencies
 */
import { getDefinitionForType } from '../elements';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../constants';
import escapeHTML from './escapeHTML';

const DOUBLE_DASH_ESCAPE = '_DOUBLEDASH_';
const ALLOWED_CONTENT_NODES = ['strong', 'em', 'u'];
const TAG_REPLACEMENTS = {
  b: 'strong',
  i: 'em',
};

/**
 * Gets content of one node.
 *
 * @param {string} content Content.
 * @param {Node}   node Node to process.
 * @return {string} Content.
 */
function getNodeContent(content, node) {
  const originalTag = node.tagName?.toLowerCase();
  const tag = TAG_REPLACEMENTS[originalTag] ?? originalTag;
  const stripTags = !ALLOWED_CONTENT_NODES.includes(tag);
  if (!stripTags) {
    content += `<${tag}>`;
  }
  if (node.childNodes.length > 0) {
    if ('p' === tag && content.trim().length) {
      content += '\n';
    }
    content = processPastedNodeList(node.childNodes, content);
  } else {
    content += escapeHTML(node.textContent);
  }
  if (!stripTags) {
    content += `</${tag}>`;
  }
  return content;
}

/**
 * Processes pasted node list.
 *
 * @param {NodeList} nodeList Node list to process.
 * @param {string}   content Initial content.
 * @return {string} Processed content.
 */
export function processPastedNodeList(nodeList, content) {
  const nodeArray = Array.from(nodeList);
  return nodeArray.reduce(getNodeContent, content);
}

/**
 * Processes pasted content to find story elements.
 *
 * @param {DocumentFragment} content NodeList representation of the content.
 * @param {Object}           currentPage Current page.
 * @return {[]} Array of found elements.
 */
export function processPastedElements(content, currentPage) {
  let foundElements = [];
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
    foundElements = [
      ...foundElements,
      ...payload.items.map(({ x, y, basedOn, ...rest }) => {
        currentPage.elements.forEach((element) => {
          if (element.id === basedOn || element.basedOn === basedOn) {
            const pastedXY = getPastedCoordinates(x, y);
            x = pastedXY.x;
            y = pastedXY.y;
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

/**
 * Processes copied/cut content for preparing elements to add to clipboard.
 *
 * @param {Object} page Page which all the elements belong to.
 * @param {Array} elements Array of story elements.
 * @param {Object} evt Copy/cut event object.
 */
export function addElementsToClipboard(page, elements, evt) {
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

/**
 * Gets x, y values for cloned/pasted element, ensuring it's not added out of the page.
 *
 * @param {number} originX Original X.
 * @param {number} originY Original Y.
 * @return {{x: (number), y: (number)}} Coordinates.
 */
export function getPastedCoordinates(originX, originY) {
  const placementDiff = 30;
  const allowedBorderDistance = 20;
  const x = originX + placementDiff;
  const y = originY + placementDiff;
  return {
    x: PAGE_WIDTH - x > allowedBorderDistance ? x : placementDiff,
    y: PAGE_HEIGHT - y > allowedBorderDistance ? y : placementDiff,
  };
}
