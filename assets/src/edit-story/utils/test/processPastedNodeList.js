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
 * Internal dependencies
 */
import processPastedNodeList from '../processPastedNodeList';

const getNodeList = (content) => {
  const template = document.createElement('template');
  template.innerHTML = content;
  return template.content.childNodes;
};

describe('processPastedNodeList', () => {
  it('should remove disallowed tags from pasted content', () => {
    const nodeList = getNodeList(
      '<p><span>Hello</span> <h3>World</h3><section>!</section></p>'
    );
    expect(processPastedNodeList(nodeList, '')).toStrictEqual('Hello World!');
  });

  it('should keep strong, em, and u tags', () => {
    const nodeList = getNodeList(
      '<p><strong>Hello</strong> <u>World</u><em>!</em></p>'
    );
    expect(processPastedNodeList(nodeList, '')).toStrictEqual(
      '<strong>Hello<strong/> <u>World<u/><em>!<em/>'
    );
  });

  it('should remove all tag attributes', () => {
    const nodeList = getNodeList(
      '<p><strong class="foo">Hello</strong> <u style="font-size:36px">World</u><em data-bar="foo-bar">!</em></p>'
    );
    expect(processPastedNodeList(nodeList, '')).toStrictEqual(
      '<strong>Hello<strong/> <u>World<u/><em>!<em/>'
    );
  });

  it('should maintain escaped HTML', () => {
    const nodeList = getNodeList('<p>Use &lt;u&gt; for underline.</p>');
    expect(processPastedNodeList(nodeList, '')).toStrictEqual(
      'Use &lt;u&gt; for underline.'
    );
  });

  it('should add line break between paragraphs', () => {
    const nodeList = getNodeList('<p>Hello</p><p>World</p>');
    expect(processPastedNodeList(nodeList, '')).toStrictEqual('Hello\nWorld');
  });
});
