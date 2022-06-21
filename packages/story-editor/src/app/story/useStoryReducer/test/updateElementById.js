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

describe('updateElementById', () => {
  it('should update the given element', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with a current page with an element.
    restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
    });

    const result = updateElementById({
      elementId: '123',
      properties: { a: 1 },
    });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '123', a: 1 }, { id: '456' }] },
    ]);
  });

  it('should update the given element via an update function', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with a current page with an element.
    restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
    });

    const result = updateElementById({
      elementId: '123',
      properties: () => ({ a: 1 }),
    });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '123', a: 1 }, { id: '456' }] },
    ]);
  });

  it('should skip reserved properties when updating by function', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with a current page with an element.
    restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
    });

    const result = updateElementById({
      elementId: '123',
      properties: () => ({ a: 1, id: '321' }),
    });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '123', a: 1 }, { id: '456' }] },
    ]);
  });

  it('should do nothing if update by function only attempts reserved attributes', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with a current page with an element.
    const initial = restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
    });

    const result = updateElementById({
      elementId: '123',
      properties: () => ({ id: '321' }),
    });

    // TODO: Use .toBe() and ensure that the test still passes.
    expect(result).toStrictEqual(initial);
  });

  it('should not allow updating reserved properties', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with a current page with an element.
    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true, isDefaultBackground: true, x: 1 },
            { id: '456' },
          ],
        },
      ],
      current: '111',
    });

    // only x=2 is allowed to be changed here
    const result = updateElementById({
      elementId: '123',
      properties: {
        x: 2,
        id: '000',
        isBackground: false,
        isDefaultBackground: false,
      },
    });

    expect(result.pages).toStrictEqual([
      {
        id: '111',
        elements: [
          { id: '123', isBackground: true, isDefaultBackground: true, x: 2 },
          { id: '456' },
        ],
      },
    ]);
  });

  it('should ignore an unknown element (on the current page)', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with multiple pages with elements.
    restore({
      pages: [
        { id: '111', elements: [{ id: '123' }] },
        { id: '222', elements: [{ id: '456' }] },
      ],
      current: '111',
    });

    // 456 does not exist on current page, so nothing happens
    const result = updateElementById({
      elementId: '456',
      properties: { a: 1 },
    });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '123' }] },
      { id: '222', elements: [{ id: '456' }] },
    ]);
  });

  it('should update animations correctly', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with one page with elements and animations
    restore({
      pages: [
        {
          id: 'p1',
          animations: [
            { id: 'a1', targets: ['e3'] },
            { id: 'a2', targets: ['e3'] },
            { id: 'a3', targets: ['e2'] },
          ],
          elements: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }],
        },
      ],
      current: 'p1',
    });

    // update animation a2:
    const result = updateElementById({
      elementId: 'e3',
      properties: {
        animation: { id: 'a2', newProp: 'x' },
      },
    });

    expect(result.pages[0].animations).toStrictEqual([
      { id: 'a1', targets: ['e3'] },
      { id: 'a2', targets: ['e3'], newProp: 'x' },
      { id: 'a3', targets: ['e2'] },
    ]);
  });

  it('should add animations correctly', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with one page with elements and no animations
    restore({
      pages: [
        {
          id: 'p1',
          elements: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }],
        },
      ],
      current: 'p1',
    });

    // add animation a4:
    const result = updateElementById({
      elementId: 'e3',
      properties: {
        animation: { id: 'a4' },
      },
    });

    expect(result.pages[0].animations).toStrictEqual([
      { id: 'a4', targets: ['e3'] },
    ]);
  });

  it('should delete animations correctly', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with one page with elements and animations
    restore({
      pages: [
        {
          id: 'p1',
          animations: [
            { id: 'a1', targets: ['e3'] },
            { id: 'a2', targets: ['e3'] },
            { id: 'a3', targets: ['e2'] },
          ],
          elements: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }],
        },
      ],
      current: 'p1',
    });

    // delete animation a1:
    const result = updateElementById({
      elementId: 'e3',
      properties: {
        animation: { id: 'a1', delete: true },
      },
    });

    expect(result.pages[0].animations).toStrictEqual([
      { id: 'a2', targets: ['e3'] },
      { id: 'a3', targets: ['e2'] },
    ]);
  });

  it('if updating both animation and regular element property, only animation gets updated', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with one page with elements and animations
    restore({
      pages: [
        {
          id: 'p1',
          animations: [
            { id: 'a1', targets: ['e3'] },
            { id: 'a2', targets: ['e3'] },
            { id: 'a3', targets: ['e2'] },
          ],
          elements: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3', a: 11 }],
        },
      ],
      current: 'p1',
    });

    // update animation a2 and change property 'a'
    const result = updateElementById({
      elementId: 'e3',
      properties: {
        a: 22,
        animation: { id: 'a2', newProp: 'x' },
      },
    });

    expect(result.pages[0].animations).toStrictEqual([
      { id: 'a1', targets: ['e3'] },
      { id: 'a2', targets: ['e3'], newProp: 'x' },
      { id: 'a3', targets: ['e2'] },
    ]);
    // Note that property 'a' was not changed
    expect(result.pages[0].elements).toStrictEqual([
      { id: 'e1' },
      { id: 'e2' },
      { id: 'e3', a: 11 },
    ]);
  });
});
