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
import { MaskTypes } from '@googleforcreators/masks';
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import { setupReducer } from './_utils';

describe('combineElements', () => {
  beforeAll(() => {
    elementTypes.forEach(registerElementType);
  });

  it('should do nothing if first element is missing', () => {
    const { restore, combineElements } = setupReducer();

    const initial = restore(getDefaultState1());

    // Combine nothing into 789
    const result = combineElements({ secondId: '789' });

    expect(result).toBe(initial);
  });

  it('should do nothing if second element is missing', () => {
    const { restore, combineElements } = setupReducer();

    const state = getDefaultState1();
    const initial = restore(state);

    // Combine 456 into nothing
    const result = combineElements({
      firstElement: state.pages[0].elements[1],
    });

    expect(result).toBe(initial);
  });

  it('should do nothing if second element does not exist', () => {
    const { restore, combineElements } = setupReducer();

    const state = getDefaultState1();
    const initial = restore(state);

    // Combine 456 into non-existing element abc
    const result = combineElements({
      firstElement: state.pages[0].elements[1],
      secondId: 'abc',
    });

    expect(result).toBe(initial);
  });

  it('should do nothing if first element does not have a resource', () => {
    const { restore, combineElements } = setupReducer();

    const state = getDefaultState1();
    const initial = restore(state);

    // Combine element 789 into 456 (789 does not have a resource)
    const result = combineElements({
      firstElement: state.pages[0].elements[2],
      secondId: '456',
    });

    expect(result).toBe(initial);
  });

  it('should combine elements when the origin does not exist as an element', () => {
    const { restore, combineElements } = setupReducer();

    const state = getDefaultState1();
    restore(state);

    // Combine non-existing element into 789
    const result = combineElements({
      firstElement: {
        id: 'abc',
        type: 'video',
        focalX: 20,
        resource: { type: 'video', src: '1' },
        x: 10,
        y: 10,
        width: 10,
        height: 10,
      },
      secondId: '789',
    });

    expect(result.pages[0].elements).toStrictEqual([
      {
        id: '123',
        type: 'shape',
        isBackground: true,
        isDefaultBackground: true,
        x: 1,
        y: 1,
        width: 1,
        height: 1,
      },
      {
        id: '456',
        type: 'video',
        focalX: 20,
        resource: { type: 'video', src: '1' },
        x: 10,
        y: 10,
        width: 10,
        height: 10,
        tracks: ['track-1'],
      },
      {
        id: '789',
        resource: { type: 'video', src: '1' },
        type: 'video',
        // Note that focalX is copied and focalY is reset to 50
        focalX: 20,
        focalY: 50,
        scale: 100,
        x: 20,
        y: 20,
        width: 20,
        height: 20,
        flip: {
          vertical: false,
          horizontal: true,
        },
        overlay: { r: 1, g: 1, b: 1 },
      },
    ]);
  });

  it('should add the relevant properties from first to second', () => {
    const { restore, combineElements } = setupReducer();

    const state = getDefaultState1();
    restore(state);

    // Combine element 456 into 789
    const result = combineElements({
      firstElement: state.pages[0].elements[1],
      secondId: '789',
    });

    expect(result.pages[0].elements).toStrictEqual([
      {
        id: '123',
        type: 'shape',
        isBackground: true,
        isDefaultBackground: true,
        x: 1,
        y: 1,
        width: 1,
        height: 1,
      },
      {
        id: '789',
        resource: { type: 'video', src: '1' },
        type: 'video',
        // Note that focalX is copied and focalY is reset to 50
        focalX: 20,
        focalY: 50,
        scale: 100,
        x: 20,
        y: 20,
        width: 20,
        height: 20,
        tracks: ['track-1'],
        flip: {
          vertical: false,
          horizontal: true,
        },
        overlay: { r: 1, g: 1, b: 1 },
      },
    ]);
  });

  it('should preserve selection if first element was selected and second was background', () => {
    const { restore, combineElements } = setupReducer();

    const state = getDefaultState1();
    restore(state);

    // Combine element 456 into 123
    const result = combineElements({
      firstElement: state.pages[0].elements[1],
      secondId: '123',
    });

    expect(result.selection).toStrictEqual(['123']);
  });

  it('should preserve selection if first element was selected and second was not background', () => {
    const { restore, combineElements } = setupReducer();

    const state = getDefaultState1();
    restore(state);

    // Combine element 456 into 789
    const result = combineElements({
      firstElement: state.pages[0].elements[1],
      secondId: '789',
    });

    expect(result.selection).toStrictEqual(['789']);
  });

  it('should keep the poster of the first video', () => {
    const { restore, combineElements } = setupReducer();

    const state = getDefaultState4();
    restore(getDefaultState4());

    // Combine element 789 into 007
    const result = combineElements({
      firstElement: state.pages[0].elements[2],
      secondId: '007',
    });

    expect(result.pages[0].elements).toStrictEqual([
      {
        id: '123',
        type: 'image',
        overlay: { color: { r: 0, g: 0, b: 0 } },
        isBackground: true,
        x: 1,
        y: 1,
        width: 1,
        height: 1,
      },
      {
        id: '456',
        type: 'image',
        resource: { type: 'image', src: '1' },
        x: 10,
        y: 10,
        width: 10,
        height: 10,
        link: {
          url: 'https://link456.example/',
          icon: 'https://link456.example/image.png',
          desc: 'Lorem ipsum dolor',
        },
      },
      {
        id: '007',
        type: 'video',
        resource: { type: 'video', src: '2' },
        focalX: 50,
        focalY: 50,
        scale: 100,
        x: 10,
        y: 10,
        width: 10,
        height: 10,
        link: {
          url: 'https://link789.example/',
          icon: 'https://link789.example/image.png',
          desc: 'Lorem ipsum dolor',
        },
        poster: 'img.jpg',
      },
    ]);
  });

  it('should not remove background overlay if present on second element', () => {
    const { restore, combineElements } = setupReducer();

    const state = getDefaultState3();
    restore(getDefaultState3());

    // Combine element 456 into 123
    const result = combineElements({
      firstElement: state.pages[0].elements[1],
      secondId: '123',
    });

    expect(result.pages[0].elements).toStrictEqual([
      {
        id: '123',
        resource: { type: 'image', src: '1' },
        type: 'image',
        focalX: 50,
        focalY: 50,
        scale: 100,
        overlay: { color: { r: 0, g: 0, b: 0 } },
        x: 10,
        y: 10,
        width: 10,
        height: 10,
        isBackground: true,
      },
    ]);
  });

  it('should copy dimensions too if combining with background element', () => {
    const { restore, combineElements } = setupReducer();

    const state = getDefaultState2();
    restore(state);

    // Combine element 456 into 123
    const result = combineElements({
      firstElement: state.pages[0].elements[1],
      secondId: '123',
    });

    expect(result.pages[0].elements).toStrictEqual([
      {
        id: '123',
        resource: { type: 'image', src: '1' },
        alt: 'Hello',
        type: 'image',
        focalX: 50,
        focalY: 50,
        scale: 100,
        x: 10,
        y: 10,
        width: 10,
        height: 10,
        isBackground: true,
      },
    ]);
  });

  it('should be able to copy properties from given element rather than existing', () => {
    const { restore, combineElements } = setupReducer();

    restore(getDefaultState2());

    // Combine new element into 123
    const result = combineElements({
      firstElement: {
        type: 'image',
        resource: { type: 'image', src: '2' },
        width: 30,
        height: 30,
        x: 30,
        y: 30,
      },
      secondId: '123',
    });

    expect(result.pages[0].elements).toStrictEqual([
      {
        id: '123',
        resource: { type: 'image', src: '2' },
        type: 'image',
        focalX: 50,
        focalY: 50,
        scale: 100,
        x: 30,
        y: 30,
        width: 30,
        height: 30,
        isBackground: true,
      },
      {
        id: '456',
        type: 'image',
        resource: { type: 'image', src: '1' },
        alt: 'Hello',
        x: 10,
        y: 10,
        width: 10,
        height: 10,
      },
    ]);
  });

  it('should create default background element when combining into that', () => {
    const { restore, combineElements } = setupReducer();

    const state = getDefaultState1();
    restore(state);

    // Combine element 456 into 123
    const result = combineElements({
      firstElement: state.pages[0].elements[1],
      secondId: '123',
    });

    expect(result.pages[0].defaultBackgroundElement).toStrictEqual({
      // Note that id is regenerated. It doesn't matter what it is, just
      // has to be unique and different from current
      id: expect.not.stringMatching('/^123$/'),
      type: 'shape',
      isBackground: true,
      isDefaultBackground: true,
      x: 1,
      y: 1,
      width: 1,
      height: 1,
    });
  });

  describe('combine elements with links', () => {
    it('should not preserve link if combining with background element', () => {
      const { restore, combineElements } = setupReducer();

      const state = getDefaultState4();
      restore(state);

      // Combine element 456 into 123
      const result = combineElements({
        firstElement: state.pages[0].elements[1],
        secondId: '123',
      });

      expect(result.pages[0].elements[0]).toStrictEqual({
        id: '123',
        isBackground: true,
        focalX: 50,
        focalY: 50,
        height: 10,
        resource: {
          src: '1',
          type: 'image',
        },
        overlay: { color: { r: 0, g: 0, b: 0 } },
        scale: 100,
        type: 'image',
        width: 10,
        x: 10,
        y: 10,
      });
    });

    it('should preserve the origin element link if combining with another', () => {
      const { restore, combineElements } = setupReducer();

      const state = getDefaultState4();
      restore(state);

      // Combine element 456 into 789
      const result = combineElements({
        firstElement: state.pages[0].elements[1],
        secondId: '789',
      });

      expect(result.pages[0].elements[1]).toStrictEqual({
        focalX: 50,
        focalY: 50,
        height: 10,
        id: '789',
        link: {
          url: 'https://link456.example/',
          icon: 'https://link456.example/image.png',
          desc: 'Lorem ipsum dolor',
        },
        resource: {
          src: '1',
          type: 'image',
        },
        scale: 100,
        type: 'image',
        width: 10,
        x: 10,
        y: 10,
        poster: 'img.jpg',
      });
    });

    it('should preserve the target element link if the origin is without link', () => {
      const { restore, combineElements } = setupReducer();

      const state = getDefaultState4();
      restore(state);

      // Combine element 456 into 789
      const result = combineElements({
        firstElement: state.pages[0].elements[3],
        secondId: '789',
      });

      expect(result.pages[0].elements[2]).toStrictEqual({
        height: 10,
        id: '789',
        link: {
          url: 'https://link789.example/',
          icon: 'https://link789.example/image.png',
          desc: 'Lorem ipsum dolor',
        },
        resource: {
          src: '3',
          type: 'video',
        },
        poster: 'img.jpg',
        scale: 100,
        type: 'video',
        width: 10,
        x: 10,
        y: 10,
        focalX: 50,
        focalY: 50,
      });
    });
  });

  describe('combine elements with borders', () => {
    it('should not preserve border if combining with background element', () => {
      const { restore, combineElements } = setupReducer();

      const state = getDefaultState5();
      restore(state);

      // Combine element 456 into 123
      const result = combineElements({
        firstElement: state.pages[0].elements[1],
        secondId: '123',
      });

      expect(result.pages[0].elements[0]).toStrictEqual({
        id: '123',
        isBackground: true,
        focalX: 50,
        focalY: 50,
        height: 10,
        resource: {
          src: '1',
          type: 'image',
        },
        overlay: { color: { r: 0, g: 0, b: 0 } },
        scale: 100,
        type: 'image',
        width: 10,
        x: 10,
        y: 10,
      });
    });

    it('should preserve the origin element border if combining into rectangle', () => {
      const { restore, combineElements } = setupReducer();

      const state = getDefaultState5();
      restore(state);

      // Combine element 456 into 101
      const result = combineElements({
        firstElement: state.pages[0].elements[1],
        secondId: '101',
      });

      expect(result.pages[0].elements[2]).toStrictEqual({
        focalX: 50,
        focalY: 50,
        height: 10,
        id: '101',
        mask: {
          type: MaskTypes.RECTANGLE,
        },
        border: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
        },
        resource: {
          src: '1',
          type: 'image',
        },
        scale: 100,
        type: 'image',
        width: 10,
        x: 10,
        y: 10,
      });
    });

    it('should preserve the border of origin element even when combining with non-rectangular', () => {
      const { restore, combineElements } = setupReducer();

      const state = getDefaultState5();
      restore(state);

      // Combine element 456 into 789
      const result = combineElements({
        firstElement: state.pages[0].elements[1],
        secondId: '789',
      });

      expect(result.pages[0].elements[1]).toStrictEqual({
        height: 10,
        id: '789',
        resource: {
          src: '1',
          type: 'image',
        },
        mask: {
          type: 'circle',
        },
        scale: 100,
        type: 'image',
        width: 10,
        x: 10,
        y: 10,
        focalX: 50,
        focalY: 50,
        border: {
          bottom: 10,
          left: 10,
          right: 10,
          top: 10,
        },
      });
    });
  });

  describe('combine elements with border radius', () => {
    it('should not preserve border if combining with background element', () => {
      const { restore, combineElements } = setupReducer();

      const state = getDefaultState6();
      restore(state);

      // Combine element 456 into 123
      const result = combineElements({
        firstElement: state.pages[0].elements[1],
        secondId: '123',
      });

      expect(result.pages[0].elements[0]).toStrictEqual({
        id: '123',
        isBackground: true,
        focalX: 50,
        focalY: 50,
        height: 10,
        resource: {
          src: '1',
          type: 'image',
        },
        overlay: { color: { r: 0, g: 0, b: 0 } },
        scale: 100,
        type: 'image',
        width: 10,
        x: 10,
        y: 10,
      });
    });

    it('should preserve the origin element border if combining into rectangle', () => {
      const { restore, combineElements } = setupReducer();

      const state = getDefaultState6();
      restore(state);

      // Combine element 456 into 101
      const result = combineElements({
        firstElement: state.pages[0].elements[1],
        secondId: '101',
      });

      expect(result.pages[0].elements[2]).toStrictEqual({
        focalX: 50,
        focalY: 50,
        height: 10,
        id: '101',
        mask: {
          type: MaskTypes.RECTANGLE,
        },
        borderRadius: {
          topLeft: 10,
          topRight: 10,
          bottomRight: 10,
          bottomLeft: 10,
        },
        resource: {
          src: '1',
          type: 'image',
        },
        scale: 100,
        type: 'image',
        width: 10,
        x: 10,
        y: 10,
      });
    });

    it('should not preserve the border radius of origin element when combining with non-rectangular', () => {
      const { restore, combineElements } = setupReducer();

      const state = getDefaultState6();
      restore(state);

      // Combine element 456 into 789
      const result = combineElements({
        firstElement: state.pages[0].elements[1],
        secondId: '789',
      });

      expect(result.pages[0].elements[1]).toStrictEqual({
        height: 10,
        id: '789',
        resource: {
          src: '1',
          type: 'image',
        },
        mask: {
          type: 'circle',
        },
        scale: 100,
        type: 'image',
        width: 10,
        x: 10,
        y: 10,
        focalX: 50,
        focalY: 50,
      });
    });
  });

  describe('combine elements with animations', () => {
    it('should by default remove animations only from the original element', () => {
      const { restore, combineElements } = setupReducer();

      const state = getDefaultState7();
      restore(state);

      // Combine element 456 into 789
      const result = combineElements({
        firstElement: state.pages[0].elements[1],
        secondId: '789',
      });

      expect(result.pages[0].animations).toStrictEqual([
        { id: 'b', targets: ['789'] },
      ]);
    });

    it('should remove animations from both elements if instructed', () => {
      const { restore, combineElements } = setupReducer();

      const state = getDefaultState7();
      restore(state);

      // Combine element 456 into 789 with retain elements flag set to false
      const result = combineElements({
        firstElement: state.pages[0].elements[1],
        secondId: '789',
        shouldRetainAnimations: false,
      });

      expect(result.pages[0].animations).toStrictEqual([]);
    });
  });
});

function getDefaultState1() {
  return {
    pages: [
      {
        id: '111',
        elements: [
          {
            id: '123',
            type: 'shape',
            isBackground: true,
            isDefaultBackground: true,
            x: 1,
            y: 1,
            width: 1,
            height: 1,
          },
          {
            id: '456',
            type: 'video',
            focalX: 20,
            resource: { type: 'video', src: '1' },
            x: 10,
            y: 10,
            width: 10,
            height: 10,
            tracks: ['track-1'],
          },
          {
            id: '789',
            type: 'shape',
            focalX: 10,
            focalY: 100,
            x: 20,
            y: 20,
            width: 20,
            height: 20,
            flip: {
              vertical: false,
              horizontal: true,
            },
            overlay: { r: 1, g: 1, b: 1 },
          },
        ],
      },
    ],
    current: '111',
    selection: ['456'],
  };
}

function getDefaultState2() {
  return {
    pages: [
      {
        id: '111',
        elements: [
          {
            id: '123',
            type: 'shape',
            isBackground: true,
            x: 1,
            y: 1,
            width: 1,
            height: 1,
          },
          {
            id: '456',
            type: 'image',
            resource: { type: 'image', src: '1' },
            x: 10,
            y: 10,
            width: 10,
            height: 10,
            alt: 'Hello',
          },
        ],
      },
    ],
    current: '111',
  };
}

function getDefaultState3() {
  return {
    pages: [
      {
        id: '111',
        elements: [
          {
            id: '123',
            type: 'image',
            overlay: { color: { r: 0, g: 0, b: 0 } },
            isBackground: true,
            x: 1,
            y: 1,
            width: 1,
            height: 1,
          },
          {
            id: '456',
            type: 'image',
            resource: { type: 'image', src: '1' },
            x: 10,
            y: 10,
            width: 10,
            height: 10,
          },
        ],
      },
    ],
    current: '111',
  };
}

// State with background element, 2 elements with links, 1 without.
function getDefaultState4() {
  return {
    pages: [
      {
        id: '111',
        elements: [
          {
            id: '123',
            type: 'image',
            overlay: { color: { r: 0, g: 0, b: 0 } },
            isBackground: true,
            x: 1,
            y: 1,
            width: 1,
            height: 1,
          },
          {
            id: '456',
            type: 'image',
            resource: { type: 'image', src: '1' },
            x: 10,
            y: 10,
            width: 10,
            height: 10,
            link: {
              url: 'https://link456.example/',
              icon: 'https://link456.example/image.png',
              desc: 'Lorem ipsum dolor',
            },
          },
          {
            id: '789',
            type: 'video',
            resource: { type: 'video', src: '2' },
            x: 10,
            y: 10,
            width: 10,
            height: 10,
            link: {
              url: 'https://link789.example/',
              icon: 'https://link789.example/image.png',
              desc: 'Lorem ipsum dolor',
            },
            poster: 'img.jpg',
          },
          {
            id: '007',
            type: 'video',
            resource: { type: 'video', src: '3' },
            x: 10,
            y: 10,
            width: 10,
            height: 10,
          },
        ],
      },
    ],
    current: '111',
  };
}

// Page with rectangular element with border, circular without border, rectangle without border.
function getDefaultState5() {
  return {
    pages: [
      {
        id: '111',
        elements: [
          {
            id: '123',
            type: 'image',
            overlay: { color: { r: 0, g: 0, b: 0 } },
            isBackground: true,
            x: 1,
            y: 1,
            width: 1,
            height: 1,
          },
          {
            id: '456',
            type: 'image',
            resource: { type: 'image', src: '1' },
            x: 10,
            y: 10,
            width: 10,
            height: 10,
            border: {
              top: 10,
              left: 10,
              right: 10,
              bottom: 10,
            },
          },
          {
            id: '789',
            type: 'shape',
            x: 10,
            y: 10,
            width: 10,
            height: 10,
            mask: {
              type: MaskTypes.CIRCLE,
            },
          },
          {
            id: '101',
            type: 'shape',
            x: 10,
            y: 10,
            width: 10,
            height: 10,
            mask: {
              type: MaskTypes.RECTANGLE,
            },
            border: {
              top: 2,
              left: 2,
              right: 2,
              bottom: 2,
            },
          },
        ],
      },
    ],
    current: '111',
  };
}

// Page with rectangular element with border radius, circular without, rectangle without.
function getDefaultState6() {
  return {
    pages: [
      {
        id: '111',
        elements: [
          {
            id: '123',
            type: 'image',
            overlay: { color: { r: 0, g: 0, b: 0 } },
            isBackground: true,
            x: 1,
            y: 1,
            width: 1,
            height: 1,
          },
          {
            id: '456',
            type: 'image',
            resource: { type: 'image', src: '1' },
            x: 10,
            y: 10,
            width: 10,
            height: 10,
            borderRadius: {
              topLeft: 10,
              topRight: 10,
              bottomRight: 10,
              bottomLeft: 10,
            },
          },
          {
            id: '789',
            type: 'shape',
            x: 10,
            y: 10,
            width: 10,
            height: 10,
            mask: {
              type: MaskTypes.CIRCLE,
            },
          },
          {
            id: '101',
            type: 'shape',
            x: 10,
            y: 10,
            width: 10,
            height: 10,
            mask: {
              type: MaskTypes.RECTANGLE,
            },
            borderRadius: {
              topLeft: 1,
              topRight: 1,
              bottomRight: 1,
              bottomLeft: 1,
            },
          },
        ],
      },
    ],
    current: '111',
  };
}

// State with background element, 1 media element, 1 shape, and animations on both latter elements
function getDefaultState7() {
  return {
    pages: [
      {
        id: '111',
        animations: [
          { id: 'a', targets: ['456'] },
          { id: 'b', targets: ['789'] },
        ],
        elements: [
          {
            id: '123',
            type: 'image',
            overlay: { color: { r: 0, g: 0, b: 0 } },
            isBackground: true,
            x: 1,
            y: 1,
            width: 1,
            height: 1,
          },
          {
            id: '456',
            type: 'image',
            resource: { type: 'image', src: '1' },
            x: 10,
            y: 10,
            width: 10,
            height: 10,
          },
          {
            id: '789',
            type: 'shape',
            x: 10,
            y: 10,
            width: 10,
            height: 10,
          },
        ],
      },
    ],
    current: '111',
  };
}
