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
const ALLOWED_CONTENT_NODES = ['strong', 'em', 'u'];

let span = null;
let textNode = null;

function escapeHTML(text) {
  if (!span) {
    span = document.createElement('span');
    textNode = document.createTextNode('');
    span.appendChild(textNode);
  }
  textNode.nodeValue = text;
  return span.innerHTML;
}

function processNodeContent(node) {
  const tag = node.parentNode?.tagName?.toLowerCase();
  const stripTags = !ALLOWED_CONTENT_NODES.includes(tag);
  const content = escapeHTML(node.textContent).trim();
  if (stripTags) {
    return content;
  }
  return `<${tag}>${content}<${tag}/>`;
}

export default function processPastedNodeList(nodeList, content) {
  for (let i = 0; i < nodeList.length; i++) {
    const n = nodeList[i];
    if (n.childNodes.length > 0) {
      if ('p' === n.tagName.toLowerCase() && content.trim().length) {
        content += '\n';
      }
      content = processPastedNodeList(n.childNodes, content);
    } else {
      content += processNodeContent(n);
    }
  }
  return content;
}
