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

describe('arrangeGroup', () => {
  it('should do nothing if nothing supplied', () => {
    const { restore, arrangeGroup } = setupReducer();

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

    const result = arrangeGroup({});

    expect(result).toBe(initialState);
  });

  it('should do nothing if group does not exist', () => {
    const { restore, arrangeGroup } = setupReducer();

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

    const result = arrangeGroup({ groupId: 'g1', position: 1 });

    expect(result).toBe(initialState);
  });

  it('should do nothing if group has no elements', () => {
    const { restore, arrangeGroup } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
          groups: { g1: { name: 'Group 1' } },
        },
      ],
      current: '111',
    });

    const result = arrangeGroup({ groupId: 'g1', position: 1 });

    expect(result).toBe(initialState);
  });

  it('should do nothing if group elements are already in position', () => {
    const { restore, arrangeGroup } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '234', groupId: 'g1' },
          ],
          groups: { g1: { name: 'Group 1' } },
        },
      ],
      current: '111',
    });

    const result = arrangeGroup({ groupId: 'g1', position: 1 });

    expect(result).toStrictEqual(initialState);
  });

  it('should move all elements of group to new position', () => {
    const { restore, arrangeGroup } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '234', groupId: 'g1' },
            { id: '345', groupId: 'g1' },
            { id: '456' },
          ],
          groups: { g1: { name: 'Group 1' } },
        },
      ],
      current: '111',
    });

    const result = arrangeGroup({ groupId: 'g1', position: 3 });

    expect(result.pages[0].elements).toStrictEqual([
      { id: '123', isBackground: true },
      { id: '456' },
      { id: '234', groupId: 'g1' },
      { id: '345', groupId: 'g1' },
    ]);
  });
});
