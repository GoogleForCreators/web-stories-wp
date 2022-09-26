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

describe('updateGroupById', () => {
  it('should do nothing if nothing supplied', () => {
    const { restore, updateGroupById } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
          groups: {},
        },
      ],
      current: '111',
    });

    const result = updateGroupById({});

    expect(result).toBe(initialState);
  });

  it('should not add group if it does not exist', () => {
    const { restore, updateGroupById } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
          groups: {},
        },
      ],
      current: '111',
    });

    const result = updateGroupById({ groupId: 'g1', properties: { a: 1 } });

    expect(result).toBe(initialState);
  });

  it('should update and overwrite properties in specified group', () => {
    const { restore, updateGroupById } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
          groups: {
            g1: { a: 1, b: 2 },
            g2: { c: 3, d: 4 },
          },
        },
      ],
      current: '111',
    });

    const result = updateGroupById({
      groupId: 'g1',
      properties: { a: 3, c: 4 },
    });

    expect(result.pages[0].groups).toStrictEqual({
      g1: { b: 2, a: 3, c: 4 },
      g2: { c: 3, d: 4 },
    });
  });
});
