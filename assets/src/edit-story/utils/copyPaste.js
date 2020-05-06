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
import escapeHTML from './escapeHTML';

const DOUBLE_DASH_ESCAPE = '_DOUBLEDASH_';
const ALLOWED_CONTENT_NODES = ['strong', 'em', 'u'];
const TAG_REPLACEMENTS = {
  b: 'strong',
  i: 'em',
};

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

export function processPastedNodeList(nodeList, content) {
  const nodeArray = Array.from(nodeList);
  return nodeArray.reduce(getNodeContent, content);
}

/**
 * Processes pasted content to find story elements.
 *
 * @param {string} content
 * @param {Object} currentPage
 * @return {[]} Array of found elements.
 */
export function processPastedElements(content, currentPage) {
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

export function addElementsToClipboard(elements, evt) {
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
      basedOn: element.id,
      id: undefined,
    })),
  };
  const serializedPayload = JSON.stringify(payload).replace(
    /--/g,
    DOUBLE_DASH_ESCAPE
  );

  const textContent = elements
    .map(({ type, ...rest }) => {
      const { TextContent } = getDefinitionForType(type);
      if (TextContent) {
        return TextContent({ ...rest });
      }
      return type;
    })
    .join('\n');

  const htmlContent = elements
    .map(({ type, ...rest }) => {
      const { Output } = getDefinitionForType(type);
      return renderToStaticMarkup(
        <Output element={rest} box={{ width: 100, height: 100 }} />
      );
    })
    .join('\n');

  clipboardData.setData('text/plain', textContent);
  clipboardData.setData(
    'text/html',
    `<!-- ${serializedPayload} -->${htmlContent}`
  );
}
