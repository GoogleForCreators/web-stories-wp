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
import { processPastedElements, processPastedNodeList } from '../copyPaste';
import { PAGE_WIDTH } from '../../constants';

const getNodeList = (content) => {
  const template = document.createElement('template');
  template.innerHTML = content;
  return template.content.childNodes;
};

describe('copyPaste utils', () => {
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
        '<strong>Hello</strong> <u>World</u><em>!</em>'
      );
    });

    it('should remove all tag attributes', () => {
      const nodeList = getNodeList(
        '<p><strong class="foo">Hello</strong> <u style="font-size:36px">World</u><em data-bar="foo-bar">!</em></p>'
      );
      expect(processPastedNodeList(nodeList, '')).toStrictEqual(
        '<strong>Hello</strong> <u>World</u><em>!</em>'
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

    it('should handle nested tags properly', () => {
      const nodeList = getNodeList('<strong>Hello <em>World</em>!</strong>');
      expect(processPastedNodeList(nodeList, '')).toStrictEqual(
        '<strong>Hello <em>World</em>!</strong>'
      );
    });

    it('should convert `b` and `i` tags to `strong` and `em` respectively', () => {
      const nodeList = getNodeList('<b>Hello <i>World</i>!</b>');
      expect(processPastedNodeList(nodeList, '')).toStrictEqual(
        '<strong>Hello <em>World</em>!</strong>'
      );
    });
  });

  describe('processPastedElements', () => {
    const DOUBLE_DASH_ESCAPE = '_DOUBLEDASH_';
    const TEXT_ELEMENT = {
      opacity: 100,
      rotationAngle: 0,
      type: 'text',
      content: 'Fill in some text',
      x: 91,
      y: 23,
      basedOn: 'text',
    };
    const IMAGE_ELEMENT = {
      type: 'image',
      x: PAGE_WIDTH,
      y: 41,
      width: 220,
      height: 202,
      basedOn: 'image',
    };

    let template;

    beforeEach(() => {
      template = document.createElement('template');
      const payload = JSON.stringify({
        sentinel: 'story-elements',
        items: [TEXT_ELEMENT, IMAGE_ELEMENT],
      }).replace(/--/g, DOUBLE_DASH_ESCAPE);
      const htmlContent = '<div>Foo</div>';
      const innerHTML = `<!-- ${payload} -->${htmlContent}`;

      template.innerHTML = innerHTML;
    });

    it('should detect elements as expected', () => {
      const processedElements = processPastedElements(template.content, {
        elements: [],
      });
      expect(processedElements).toHaveLength(2);
      expect(processedElements[0]).toStrictEqual({
        ...TEXT_ELEMENT,
        id: expect.any(String),
      });
      expect(processedElements[1]).toStrictEqual({
        ...IMAGE_ELEMENT,
        id: expect.any(String),
      });
    });

    it('should set the position values based on the origin elements correctly', () => {
      const currentPage = {
        elements: [
          {
            id: 'text',
          },
          {
            id: 'image',
          },
        ],
      };
      const processedElements = processPastedElements(
        template.content,
        currentPage
      );
      expect(processedElements[0]).toStrictEqual({
        ...TEXT_ELEMENT,
        x: 121,
        y: 53,
        id: expect.any(String),
      });
      expect(processedElements[1]).toStrictEqual({
        ...IMAGE_ELEMENT,
        x: 30,
        y: 71,
        id: expect.any(String),
      });
    });

    it('should not find elements without a comment in document fragment', () => {
      const templateWithoutComment = document.createElement('template');
      const payload = JSON.stringify({
        sentinel: 'story-elements',
        items: [TEXT_ELEMENT, IMAGE_ELEMENT],
      }).replace(/--/g, DOUBLE_DASH_ESCAPE);

      templateWithoutComment.innerHTML = `${payload}`;
      const processedElements = processPastedElements(
        templateWithoutComment.content,
        {
          elements: [],
        }
      );
      expect(processedElements).toStrictEqual([]);
    });
  });
});
