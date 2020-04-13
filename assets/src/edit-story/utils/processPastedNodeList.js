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
const allowedContentNodes = ['strong', 'em', 'u'];

function processNodeContent(node) {
  const tag = node.parentNode?.tagName?.toLowerCase();
  const stripTags = !allowedContentNodes.includes(tag);
  if (stripTags) {
    return node.textContent.trim();
  }
  return `<${tag}>${node.textContent.trim()}<${tag}/>`;
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
      content += processNodeContent(n, content);
    }
  }
  return content;
}
