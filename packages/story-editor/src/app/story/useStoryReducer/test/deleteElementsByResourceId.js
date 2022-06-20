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

describe('deleteElementsByResourceId', () => {
  it('should remove the deleted elements', () => {
    const { restore, deleteElementsByResourceId } = setupReducer();

    // Set an initial state.
    restore({
      pages: [
        {
          id: '111',
          defaultBackgroundElement: {
            id: '1',
            isDefaultBackground: true,
            isBackground: true,
          },
          elements: [
            {
              id: '789',
              isBackground: true,
              resource: { type: 'image', id: '11' },
            },
            { id: '123', resource: { type: 'video', id: '10' } },
            { id: '456', resource: { type: 'video', id: '10' } },
          ],
        },
        {
          id: '222',
          elements: [
            {
              id: '456',
              isBackground: true,
              resource: { type: 'image', id: '11' },
            },
            { id: '123', resource: { type: 'video', id: '10' } },
          ],
        },
      ],
      current: '111',
      selection: ['456', '789'],
    });

    const result = deleteElementsByResourceId({
      id: '10',
    });

    expect(result.pages).toStrictEqual([
      {
        id: '111',
        defaultBackgroundElement: {
          id: '1',
          isBackground: true,
          isDefaultBackground: true,
        },
        elements: [
          {
            id: '789',
            isBackground: true,
            resource: { type: 'image', id: '11' },
          },
        ],
      },
      {
        id: '222',
        elements: [
          {
            id: '456',
            isBackground: true,
            resource: { type: 'image', id: '11' },
          },
        ],
      },
    ]);
    expect(result.selection).toStrictEqual(['789']);
  });

  it('should insert default page background if deleting current background', () => {
    const { restore, deleteElementsByResourceId } = setupReducer();

    // Set an initial state.
    restore({
      pages: [
        {
          id: '111',
          defaultBackgroundElement: { id: 'e0', type: 'shape' },
          elements: [
            {
              id: '123',
              isBackground: true,
              resource: { type: 'image', id: '11' },
            },
            { id: '456', resource: { type: 'video', id: '10' } },
          ],
        },
      ],
      current: '111',
      selection: ['123'],
    });

    const result = deleteElementsByResourceId({
      id: '11',
    });

    expect(result.pages).toStrictEqual([
      {
        id: '111',
        defaultBackgroundElement: { id: 'e0', type: 'shape' },
        elements: [
          { id: 'e0', type: 'shape' },
          { id: '456', resource: { type: 'video', id: '10' } },
        ],
      },
    ]);
    expect(result.selection).toStrictEqual([]);
  });

  it('should remove any animations belonging to the deleted elements', () => {
    const { restore, deleteElementsByResourceId } = setupReducer();

    // Set an initial state.
    restore({
      pages: [
        {
          id: '111',
          animations: [
            { id: 'a', targets: ['123'] },
            { id: 'b', targets: ['456'] },
            { id: 'c', targets: ['789'] },
          ],
          defaultBackgroundElement: {
            id: '1',
            isDefaultBackground: true,
            isBackground: true,
          },
          elements: [
            { id: '123', resource: { type: 'video', id: '10' } },
            { id: '456', resource: { type: 'video', id: '10' } },
            { id: '789', resource: { type: 'image', id: '11' } },
          ],
        },
        {
          id: '222',
          defaultBackgroundElement: {
            id: '2',
            isDefaultBackground: true,
            isBackground: true,
          },
          animations: [{ id: 'd', targets: ['123'] }],
          elements: [
            {
              id: '123',
              resource: { type: 'video', id: '10' },
              isBackground: true,
            },
            {
              id: '456',
              resource: { type: 'image', id: '11' },
            },
          ],
        },
      ],
      current: '111',
    });

    const result = deleteElementsByResourceId({
      id: '10',
    });

    expect(result.pages[0].elements).toStrictEqual([
      { id: '1', isDefaultBackground: true, isBackground: true },
      { id: '789', resource: { type: 'image', id: '11' } },
    ]);
    expect(result.pages[0].animations).toStrictEqual([
      { id: 'c', targets: ['789'] },
    ]);
    expect(result.pages[1].elements).toStrictEqual([
      { id: '2', isBackground: true, isDefaultBackground: true },
      { id: '456', resource: { type: 'image', id: '11' } },
    ]);
    expect(result.pages[1].animations).toStrictEqual([]);
  });

  it('should do nothing if id not given', () => {
    const { restore, deleteElementsByResourceId } = setupReducer();

    // Set an initial state.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', resource: { type: 'video', id: '10' } },
            { id: '456', resource: { type: 'image', id: '10' } },
            { id: '789', resource: { type: 'image', id: '11' } },
          ],
        },
        {
          id: '222',
          elements: [
            { id: '123', resource: { type: 'video', id: '10' } },
            { id: '456', resource: { type: 'image', id: '10' } },
          ],
        },
      ],
      current: '111',
    });

    const result = deleteElementsByResourceId({
      id: null,
    });

    expect(result).toBe(initialState);
  });

  it('should do nothing if no elements with given id', () => {
    const { restore, deleteElementsByResourceId } = setupReducer();

    // Set an initial state.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', resource: { type: 'video' } },
            { id: '456' },
            { id: '789', resource: { type: 'image', id: '11' } },
          ],
        },
        {
          id: '222',
          elements: [
            { id: '123', resource: { type: 'video', id: '10' } },
            { id: '456', resource: { type: 'image', id: '10' } },
          ],
        },
      ],
      current: '111',
    });

    const result = deleteElementsByResourceId({
      id: '12',
    });

    expect(result).toBe(initialState);
  });
});
