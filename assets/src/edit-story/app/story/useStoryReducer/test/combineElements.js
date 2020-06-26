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
import { setupReducer } from './_utils';

describe('combineElements', () => {
  it('should do nothing if first element is missing', () => {
    const { restore, combineElements } = setupReducer();

    const initial = restore(getDefaultState1());

    // Combine nothing into 789
    const result = combineElements({ secondId: '789' });

    expect(result).toStrictEqual(initial);
  });

  it('should do nothing if second element is missing', () => {
    const { restore, combineElements } = setupReducer();

    const initial = restore(getDefaultState1());

    // Combine 456 into nothing
    const result = combineElements({ firstId: '456' });

    expect(result).toStrictEqual(initial);
  });
  it('should do nothing if first element does not exist', () => {
    const { restore, combineElements } = setupReducer();

    const initial = restore(getDefaultState1());

    // Combine non-existing element abc into 789
    const result = combineElements({ firstId: 'abc', secondId: '789' });

    expect(result).toStrictEqual(initial);
  });

  it('should do nothing if second element does not exist', () => {
    const { restore, combineElements } = setupReducer();

    const initial = restore(getDefaultState1());

    // Combine 456 into non-existing element abc
    const result = combineElements({ firstId: '456', secondId: 'abc' });

    expect(result).toStrictEqual(initial);
  });

  it('should do nothing if first element does not have a resource', () => {
    const { restore, combineElements } = setupReducer();

    const initial = restore(getDefaultState1());

    // Combine element 789 into 456 (789 does not have a resource)
    const result = combineElements({ firstId: '789', secondId: '456' });

    expect(result).toStrictEqual(initial);
  });

  it('should add the relevant properties from first to second', () => {
    const { restore, combineElements } = setupReducer();

    restore(getDefaultState1());

    // Combine element 456 into 789
    const result = combineElements({ firstId: '456', secondId: '789' });

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
        resource: { type: 'image', src: '1' },
        type: 'image',
        // Note that focalX is copied and focalY is reset to 50
        focalX: 20,
        focalY: 50,
        scale: 100,
        flip: {},
        x: 20,
        y: 20,
        width: 20,
        height: 20,
      },
    ]);
  });

  it('should remove background overlay if present on second element', () => {
    const { restore, combineElements } = setupReducer();

    restore(getDefaultState3());

    // Combine element 456 into 123
    const result = combineElements({ firstId: '456', secondId: '123' });

    expect(result.pages[0].elements).toStrictEqual([
      {
        id: '123',
        resource: { type: 'image', src: '1' },
        type: 'image',
        focalX: 50,
        focalY: 50,
        scale: 100,
        flip: {},
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

    restore(getDefaultState2());

    // Combine element 456 into 123
    const result = combineElements({ firstId: '456', secondId: '123' });

    expect(result.pages[0].elements).toStrictEqual([
      {
        id: '123',
        resource: { type: 'image', src: '1' },
        type: 'image',
        focalX: 50,
        focalY: 50,
        scale: 100,
        flip: {},
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
        flip: {},
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
        x: 10,
        y: 10,
        width: 10,
        height: 10,
      },
    ]);
  });

  it('should create default background element when combining into that', () => {
    const { restore, combineElements } = setupReducer();

    restore(getDefaultState1());

    // Combine element 456 into 123
    const result = combineElements({ firstId: '456', secondId: '123' });

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
            type: 'image',
            focalX: 20,
            resource: { type: 'image', src: '1' },
            x: 10,
            y: 10,
            width: 10,
            height: 10,
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
          },
        ],
      },
    ],
    current: '111',
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
            backgroundOverlay: { color: { r: 0, g: 0, b: 0 } },
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
