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
import { createSolid } from '@googleforcreators/patterns';
import { PAGE_WIDTH } from '@googleforcreators/units';
import {
  SHARED_DEFAULT_ATTRIBUTES,
  MEDIA_DEFAULT_ATTRIBUTES,
  elementTypes,
} from '@googleforcreators/element-library';
import {
  registerElementType,
  TEXT_ELEMENT_DEFAULT_FONT,
} from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { addElementsToClipboard, processPastedElements } from '../copyPaste';

const getDefinitionForType = (type) =>
  elementTypes.find((element) => element.type === type);

describe('copyPaste utils', () => {
  beforeAll(() => {
    elementTypes.forEach(registerElementType);
  });

  const PAGE = {
    backgroundColor: createSolid(255, 0, 0),
  };
  const TEXT_ELEMENT = {
    ...getDefinitionForType('text').defaultAttributes,
    ...SHARED_DEFAULT_ATTRIBUTES,
    font: TEXT_ELEMENT_DEFAULT_FONT,
    padding: {
      horizontal: 0,
      vertical: 0,
    },
    type: 'text',
    content: 'Fill in some text',
    x: 91,
    y: 23,
    basedOn: 'text',
    width: 100,
    height: 100,
    color: createSolid(0, 0, 0),
  };
  const IMAGE_ELEMENT = {
    ...getDefinitionForType('image').defaultAttributes,
    ...SHARED_DEFAULT_ATTRIBUTES,
    ...MEDIA_DEFAULT_ATTRIBUTES,
    type: 'image',
    x: PAGE_WIDTH,
    y: 41,
    width: 220,
    height: 202,
    basedOn: 'image',
    resource: {
      type: 'image',
      mimeType: '',
      src: '',
      width: 1,
      height: 1,
    },
  };

  const SHAPE_ELEMENT = {
    ...getDefinitionForType('shape').defaultAttributes,
    ...SHARED_DEFAULT_ATTRIBUTES,
    type: 'shape',
    x: 10,
    y: 10,
    width: 10,
    height: 10,
    mask: {
      type: 'rectangle',
    },
    basedOn: 'shape',
    isBackground: true,
    backgroundColor: createSolid(1, 1, 1),
  };

  const ANIMATION = {
    type: 'BOUNCE',
    targets: ['shape'],
    duration: 1000,
    delay: 0,
  };

  describe('processPastedElements', () => {
    const DOUBLE_DASH_ESCAPE = '_DOUBLEDASH_';

    let template;

    beforeEach(() => {
      template = document.createElement('template');
      const payload = JSON.stringify({
        sentinel: 'story-elements',
        items: [TEXT_ELEMENT, IMAGE_ELEMENT, SHAPE_ELEMENT],
        animations: [ANIMATION],
      }).replace(/--/g, DOUBLE_DASH_ESCAPE);
      const htmlContent = '<div>Foo</div>';
      const innerHTML = `<!-- ${payload} -->${htmlContent}`;

      template.innerHTML = innerHTML;
    });

    it('should detect elements as expected', () => {
      const { elements: processedElements } = processPastedElements(
        template.content,
        {
          elements: [],
        }
      );
      expect(processedElements).toHaveLength(3);
      expect(processedElements[0]).toStrictEqual({
        ...TEXT_ELEMENT,
        id: expect.any(String),
      });
      expect(processedElements[1]).toStrictEqual({
        ...IMAGE_ELEMENT,
        id: expect.any(String),
      });
      expect(processedElements[2]).toStrictEqual({
        ...SHAPE_ELEMENT,
        id: expect.any(String),
      });
    });

    it('should detect animations as expected and update target to new element id', () => {
      const { elements, animations } = processPastedElements(template.content, {
        elements: [],
        animations: [],
      });
      expect(animations).toHaveLength(1);
      expect(animations[0]).toStrictEqual({
        ...ANIMATION,
        id: expect.any(String),
        targets: [elements[2].id],
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
      const { elements: processedElements } = processPastedElements(
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

    it('should ignore the elements comment if sentinel is not story-elements', () => {
      const templateIncorrectSentinel = document.createElement('template');
      const payload = JSON.stringify({
        sentinel: 'foo',
        items: [TEXT_ELEMENT, IMAGE_ELEMENT],
      }).replace(/--/g, DOUBLE_DASH_ESCAPE);
      templateIncorrectSentinel.innerHTML = `<!-- ${payload} -->`;

      const { elements: processedElements } = processPastedElements(
        templateIncorrectSentinel.content,
        {
          elements: [],
        }
      );
      expect(processedElements).toStrictEqual([]);
    });

    it('should not find elements without a comment in document fragment', () => {
      const templateWithoutComment = document.createElement('template');
      const payload = JSON.stringify({
        sentinel: 'story-elements',
        items: [TEXT_ELEMENT, IMAGE_ELEMENT],
      }).replace(/--/g, DOUBLE_DASH_ESCAPE);

      templateWithoutComment.innerHTML = `${payload}`;
      const { elements: processedElements } = processPastedElements(
        templateWithoutComment.content,
        {
          elements: [],
        }
      );
      expect(processedElements).toStrictEqual([]);
    });
  });

  describe('addElementsToClipboard', () => {
    it('should add elements correctly to clipboard', () => {
      const setData = jest.fn();
      const evt = {
        clipboardData: {
          setData,
        },
      };

      const elements = [
        {
          ...TEXT_ELEMENT,
          id: '1',
        },
      ];
      addElementsToClipboard(PAGE, elements, [], evt);

      expect(setData).toHaveBeenCalledTimes(2);
      expect(setData).toHaveBeenCalledWith('text/plain', 'Fill in some text');
      expect(setData).toHaveBeenCalledWith('text/html', expect.any(String));
    });

    it('should add background color to any background shape to clipboard', () => {
      const setData = jest.fn();
      const evt = {
        clipboardData: {
          setData,
        },
      };

      const elements = [
        {
          ...SHAPE_ELEMENT,
          id: '1',
          isDefaultBackground: true,
        },
      ];
      addElementsToClipboard(PAGE, elements, [], evt);

      expect(setData).toHaveBeenCalledTimes(2);
      expect(setData).toHaveBeenCalledWith('text/plain', 'shape');
      expect(setData).toHaveBeenCalledWith(
        'text/html',
        expect.stringMatching(
          /"backgroundColor":{"color":{"r":255,"g":0,"b":0}}/
        )
      );
    });

    it('should add elements not containing any text correctly to clipboard', () => {
      const setData = jest.fn();
      const evt = {
        clipboardData: {
          setData,
        },
      };

      const elements = [
        {
          ...SHAPE_ELEMENT,
          id: '1',
        },
      ];
      addElementsToClipboard(PAGE, elements, [], evt);

      expect(setData).toHaveBeenCalledTimes(2);
      expect(setData).toHaveBeenCalledWith('text/plain', 'shape');
      expect(setData).toHaveBeenCalledWith('text/html', expect.any(String));
    });

    it('should add animations to clipboard', () => {
      const setData = jest.fn();
      const evt = {
        clipboardData: {
          setData,
        },
      };

      const elements = [
        {
          ...SHAPE_ELEMENT,
          id: '1',
        },
      ];
      const animations = [
        {
          id: 'a',
          targets: ['1'],
          type: 'ANIMATION_TYPE',
        },
      ];
      addElementsToClipboard(PAGE, elements, animations, evt);

      expect(setData).toHaveBeenCalledTimes(2);
      expect(setData).toHaveBeenCalledWith('text/plain', 'shape');
      expect(setData).toHaveBeenCalledWith(
        'text/html',
        expect.stringMatching(/"type":"ANIMATION_TYPE"/)
      );
    });

    it('should not add anything if none are passed', () => {
      const setData = jest.fn();
      const evt = {
        clipboardData: {
          setData,
        },
      };
      addElementsToClipboard(PAGE, [], [], evt);
      expect(setData).toHaveBeenCalledTimes(0);
    });
  });
});
