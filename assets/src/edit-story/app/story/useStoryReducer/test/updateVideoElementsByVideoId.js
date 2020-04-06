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

describe('updateVideoElementsById', () => {
  it('should update all the elemtns with given id of element resource through all pages with a function', () => {
    const { restore, updateVideoElementsById } = setupReducer();

    // Set an initial state.
    restore({
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

    const result = updateVideoElementsById({
      id: '10',
      properties: ({ resource, ...rest }) => ({
        ...rest,
        resource: { ...resource, posterId: '1', poster: '2' },
      }),
    });

    expect(result.pages).toStrictEqual([
      {
        id: '111',
        elements: [
          {
            id: '123',
            resource: {
              type: 'video',
              id: '10',
              posterId: '1',
              poster: '2',
            },
          },
          {
            id: '456',
            resource: {
              type: 'image',
              id: '10',
              posterId: '1',
              poster: '2',
            },
          },
          { id: '789', resource: { type: 'image', id: '11' } },
        ],
      },
      {
        id: '222',
        elements: [
          {
            id: '123',
            resource: {
              type: 'video',
              id: '10',
              posterId: '1',
              poster: '2',
            },
          },
          {
            id: '456',
            resource: {
              type: 'image',
              id: '10',
              posterId: '1',
              poster: '2',
            },
          },
        ],
      },
    ]);
  });

  it('should update all the elements with given id of element resource through all pages', () => {
    const { restore, updateVideoElementsById } = setupReducer();

    // Set an initial state.
    restore({
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

    const result = updateVideoElementsById({
      id: '10',
      properties: {
        resource: { id: '10', posterId: '1', poster: '2' },
      },
    });

    expect(result.pages).toStrictEqual([
      {
        id: '111',
        elements: [
          {
            id: '123',
            resource: {
              id: '10',
              posterId: '1',
              poster: '2',
            },
          },
          {
            id: '456',
            resource: {
              id: '10',
              posterId: '1',
              poster: '2',
            },
          },
          { id: '789', resource: { type: 'image', id: '11' } },
        ],
      },
      {
        id: '222',
        elements: [
          {
            id: '123',
            resource: {
              id: '10',
              posterId: '1',
              poster: '2',
            },
          },
          {
            id: '456',
            resource: {
              id: '10',
              posterId: '1',
              poster: '2',
            },
          },
        ],
      },
    ]);
  });

  it('should do nothing is id not given', () => {
    const { restore, updateVideoElementsById } = setupReducer();

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

    const result = updateVideoElementsById({
      properties: ({ resource, ...rest }) => ({
        ...rest,
        resource: { ...resource, posterId: '1', poster: '2' },
      }),
    });

    expect(result).toStrictEqual(initialState);
  });

  it('should do nothing if no elements with given id', () => {
    const { restore, updateVideoElementsById } = setupReducer();

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

    const result = updateVideoElementsById({
      id: '12',
      properties: ({ resource, ...rest }) => ({
        ...rest,
        resource: { ...resource, posterId: '1', poster: '2' },
      }),
    });

    expect(result).toStrictEqual(initialState);
  });
});
