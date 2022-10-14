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
import { STORY_ANIMATION_STATE } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import { setupReducer } from './_utils';

describe('addElementsAcrossPages', () => {
  it('should add elements on individual pages and not change selection', () => {
    const { restore, addElementsAcrossPages } = setupReducer();

    // Set an initial state with a current page and other elements.
    restore({
      pages: [
        { id: '111', elements: [{ id: '000' }] },
        { id: '222', elements: [{ id: '333' }] },
      ],
      current: '111',
      selection: ['000'],
    });

    const result = addElementsAcrossPages({
      elements: [
        { id: '123', type: 'video' },
        { id: '124', type: 'video' },
        { id: '125', type: 'video' },
        { id: '126', type: 'video' },
        { id: '127', type: 'video' },
        { id: '128', type: 'video' },
        { id: '129', type: 'video' },
        { id: '130', type: 'video' },
      ],
      page: {
        id: '444',
        elements: [{ id: '555' }],
      },
      position: 0,
    });

    expect(result).toStrictEqual({
      pages: [
        { id: '111', elements: [{ id: '000' }] },
        {
          id: expect.any(String),
          elements: [{ id: expect.any(String) }, { id: '123', type: 'video' }],
        },
        {
          id: expect.any(String),
          elements: [{ id: expect.any(String) }, { id: '124', type: 'video' }],
        },
        {
          id: expect.any(String),
          elements: [{ id: expect.any(String) }, { id: '125', type: 'video' }],
        },
        {
          id: expect.any(String),
          elements: [{ id: expect.any(String) }, { id: '126', type: 'video' }],
        },
        {
          id: expect.any(String),
          elements: [{ id: expect.any(String) }, { id: '127', type: 'video' }],
        },
        {
          id: expect.any(String),
          elements: [{ id: expect.any(String) }, { id: '128', type: 'video' }],
        },
        {
          id: expect.any(String),
          elements: [{ id: expect.any(String) }, { id: '129', type: 'video' }],
        },
        {
          id: expect.any(String),
          elements: [{ id: expect.any(String) }, { id: '130', type: 'video' }],
        },
        { id: '222', elements: [{ id: '333' }] },
      ],
      current: '111',
      selection: ['000'],
      animationState: STORY_ANIMATION_STATE.RESET,
      capabilities: {},
      copiedElementState: {},
      story: {},
    });
  });
});
