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

describe('addGroup', () => {
  it('should do nothing if nothing supplied', () => {
    const { restore, addGroup } = setupReducer();

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

    const result = addGroup({});

    expect(result).toBe(initialState);
  });

  it('should do nothing if no name supplied', () => {
    const { restore, addGroup } = setupReducer();

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

    const result = addGroup({ groupId: 'g1' });

    expect(result).toBe(initialState);
  });

  it('should add group with default lock status', () => {
    const { restore, addGroup } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
          groups: {},
        },
      ],
      current: '111',
    });

    const result = addGroup({ groupId: 'g1', name: 'Group 1' });

    expect(result.pages[0].groups).toStrictEqual({
      g1: { name: 'Group 1', isLocked: false },
    });
  });

  it('should add group even if `groups` is not set', () => {
    const { restore, addGroup } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
        },
      ],
      current: '111',
    });

    const result = addGroup({ groupId: 'g1', name: 'Group 1' });

    expect(result.pages[0].groups).toStrictEqual({
      g1: { name: 'Group 1', isLocked: false },
    });
  });

  it('should add group with specified lock status', () => {
    const { restore, addGroup } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
          groups: {},
        },
      ],
      current: '111',
    });

    const result = addGroup({ groupId: 'g1', name: 'Group 1', isLocked: true });

    expect(result.pages[0].groups).toStrictEqual({
      g1: { name: 'Group 1', isLocked: true },
    });
  });
});
